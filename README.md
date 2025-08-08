We have an LLM pipeline that takes daily news stories and splits them into “actions” by major policy makers such as the President, companies or international organizations. Moreover, for each “primary action” we have associated sub-actions which can be quotes, commentary or other reactions. We rate this associated content in terms providing supporting or opposing arguments for the action.

Our vision is to create a dashboard that (a) organizes actions by days, (b) coverage of actions by left or right-leaning media, (c) side by side comparisons. Moreover, we provide an API for downloading actions and meta data.

For tech stack, we want to implement this system with an Angular web frontend and a C# backend. To run, from root directory run `python ./lego_dashboard_backend.py` which should start backend running on localhost:8080, then navigate to the lego-frontend and continue with setup.
