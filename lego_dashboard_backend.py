#!/usr/bin/env python3
"""
Lego Dashboard Backend Server
Generates simulated news action data and serves it via REST API

Example usage: 
# Get list of all publishers
curl http://localhost:8080/api/publishers

# Get all available dates
curl http://localhost:8080/api/dates

Remember to quote the URL if using a shell that interprets special characters.
# Get all actions for July 26, 2025
"curl http://localhost:8080/api/topactions?date=2025-07-26"

# Get actions filtered by Republican publishers
curl http://localhost:8080/api/topactions?date=2025-07-26&group=Republican

# Get actions for a specific publisher
curl http://localhost:8080/api/topactions?date=2025-07-26&publisher=pub_dem_0
"""

import json
import random
from datetime import datetime, timedelta
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import numpy as np

class LegoDashboardData:
    def __init__(self):
        self.publishers = self._create_publishers()
        
    def _create_publishers(self):
        """Create 110 publishers, 55 Republican and 55 Democrat"""
        publishers = []
        for i in range(55):
            publishers.append({
                'id': f'pub_rep_{i}',
                'name': f'Republican Publisher {i}',
                'leaning': 'Republican'
            })
        for i in range(55):
            publishers.append({
                'id': f'pub_dem_{i}',
                'name': f'Democrat Publisher {i}',
                'leaning': 'Democrat'
            })
        return publishers
    
    def _generate_coverage_shares(self, seed):
        """Generate decreasing coverage shares that sum to 1"""
        random.seed(seed)
        np.random.seed(seed)
        
        # Create base decreasing values
        base_values = np.array([1.0 / (i + 1) for i in range(26)])
        
        # Add some randomness
        noise = np.random.uniform(0.8, 1.2, 26)
        values = base_values * noise
        
        # Normalize to sum to 1
        return values / values.sum()
    
    def _generate_action_data(self, action_idx, coverage, seed):
        """Generate data for a single action"""
        random.seed(seed + action_idx)
        
        # Make half Republican (positive values) and half Democrat (negative values)
        is_republican = action_idx < 13
        
        if is_republican:
            republican_score = random.uniform(0, 1)
        else:
            republican_score = random.uniform(-1, 0)
        
        return {
            'Description': f'Action {chr(65 + action_idx)}',
            'Republican': round(republican_score, 3),
            'coverage': round(coverage, 4),
            'agreement': None  # Will be calculated based on aggregated publisher data
        }
    
    def _calculate_agreement_for_publisher(self, publisher, action, seed):
        """Calculate agreement rates based on publisher and action alignment"""
        random.seed(seed)
        
        # Determine if publisher and action are aligned
        publisher_is_republican = publisher['leaning'] == 'Republican'
        action_is_republican = action['Republican'] > 0
        aligned = publisher_is_republican == action_is_republican
        
        # Generate neutral rate
        neutral = random.uniform(0.1, 0.5)
        
        # Generate supporting rate based on alignment
        if aligned:
            supporting = random.uniform(0.5, 1.0) * (1 - neutral)
        else:
            supporting = random.uniform(0.0, 0.5) * (1 - neutral)
        
        # Non-supporting is the remainder
        non_supporting = 1 - neutral - supporting
        
        return [round(supporting, 3), round(non_supporting, 3), round(neutral, 3)]
    
    def generate_top_actions(self, date_str, publisher_filter=None):
        """Generate TopActions data for a specific date and optional publisher filter"""
        # Convert date string to seed
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        day_seed = int(date_obj.strftime('%Y%m%d'))
        
        # Generate base coverage shares
        coverage_shares = self._generate_coverage_shares(day_seed)
        
        # Generate actions
        actions = []
        for i in range(26):
            action = self._generate_action_data(i, coverage_shares[i], day_seed)
            
            # Calculate aggregated agreement across publishers
            if publisher_filter:
                # Filter publishers based on criteria
                filtered_publishers = self._filter_publishers(publisher_filter)
            else:
                filtered_publishers = self.publishers
            
            # Calculate weighted agreement across publishers
            total_supporting = 0
            total_non_supporting = 0
            total_neutral = 0
            total_weight = 0
            
            for pub in filtered_publishers:
                pub_seed = day_seed + hash(pub['id']) + i
                agreement = self._calculate_agreement_for_publisher(pub, action, pub_seed)
                
                # Weight by coverage (simplified - in real system would vary by publisher)
                weight = action['coverage']
                total_supporting += agreement[0] * weight
                total_non_supporting += agreement[1] * weight
                total_neutral += agreement[2] * weight
                total_weight += weight
            
            if total_weight > 0:
                action['agreement'] = [
                    round(total_supporting / total_weight, 3),
                    round(total_non_supporting / total_weight, 3),
                    round(total_neutral / total_weight, 3)
                ]
            else:
                action['agreement'] = [0.333, 0.333, 0.334]
            
            actions.append(action)
        
        # Sort by coverage (descending)
        actions.sort(key=lambda x: x['coverage'], reverse=True)
        
        return actions
    
    def _filter_publishers(self, filter_criteria):
        """Filter publishers based on criteria"""
        if filter_criteria == 'Republican':
            return [p for p in self.publishers if p['leaning'] == 'Republican']
        elif filter_criteria == 'Democrat':
            return [p for p in self.publishers if p['leaning'] == 'Democrat']
        elif filter_criteria.startswith('pub_'):
            return [p for p in self.publishers if p['id'] == filter_criteria]
        else:
            return self.publishers

class LegoDashboardHandler(BaseHTTPRequestHandler):
    data_generator = LegoDashboardData()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)
        
        if path == '/api/topactions':
            self.handle_top_actions(query_params)
        elif path == '/api/publishers':
            self.handle_publishers()
        elif path == '/api/dates':
            self.handle_available_dates()
        else:
            self.send_error(404, 'Not Found')
    
    def handle_top_actions(self, params):
        """Handle /api/topactions endpoint"""
        # Get date parameter (default to today)
        date_str = params.get('date', ['2025-07-26'])[0]
        
        # Get publisher filter
        publisher_filter = params.get('publisher', [None])[0]
        
        # Get group filter (Republican/Democrat)
        group_filter = params.get('group', [None])[0]
        
        # Apply the most specific filter
        filter_criteria = publisher_filter or group_filter
        
        try:
            # Generate data
            actions = self.data_generator.generate_top_actions(date_str, filter_criteria)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(actions, indent=2).encode())
        except Exception as e:
            self.send_error(400, f'Bad Request: {str(e)}')
    
    def handle_publishers(self):
        """Handle /api/publishers endpoint"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(self.data_generator.publishers, indent=2).encode())
    
    def handle_available_dates(self):
        """Handle /api/dates endpoint - return all dates for 2025 so far"""
        start_date = datetime(2025, 1, 1)
        end_date = datetime(2025, 7, 26)
        
        dates = []
        current_date = start_date
        while current_date <= end_date:
            dates.append(current_date.strftime('%Y-%m-%d'))
            current_date += timedelta(days=1)
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(dates, indent=2).encode())
    
    def log_message(self, format, *args):
        """Override to add timestamp to logs"""
        print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - {format % args}")

def run_server(port=8080):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, LegoDashboardHandler)
    print(f"Lego Dashboard Backend Server starting on http://localhost:{port}")
    print("\nAvailable endpoints:")
    print(f"  GET http://localhost:{port}/api/topactions")
    print(f"      Parameters: date (YYYY-MM-DD), publisher (pub_id), group (Republican/Democrat)")
    print(f"  GET http://localhost:{port}/api/publishers")
    print(f"  GET http://localhost:{port}/api/dates")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()