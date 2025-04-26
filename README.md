# pantry_planner
 Pantry Planner Personal/School Project

Pantry planner is meant to be an application to help manage your pantry and other common household items. 

Github url: https://github.com/jflehew/pantry_planner

Stack: I will be using a (python)Flask backend and a (js)React front end 
CSS: I have used the tailwindcss framework for styling
Features:
    1. a pantry to show consumable items you have in your household and how many you have.
    2. A grocery list which automatically updates based on a threshold for each consumable item. 
        a. shopping will remove all items from your gorcery list automatically and update your pantry. 
        b. did not buy button will prevent item from updating and removing itself from the grocery list
    3. api  connection to kroger products (possibly locations) for the purpose of adding products and getting accurate prices
    4. Login and registration for all users. 

Future features:
    1. I would like to track weekly usage and weekly costs for the user to help better manage expendature.
    2. connect to more API's to give users more versatility with shopping. 
    3. cart adaptability to allow users to add items to a cart for the store each item is associated with and purchase those items from the app to be ready for pickup. 
    4. shared grocery lists between multiple users for household use. 
    5. recipes/actions created by users to help manage your pantry. 
        a. recipes will have a rating and a favorite button
        b. cooking a recipe will update your pantry and grocery list accordingly. 
        c. the ability to add an item to your grocery list will appear if that product id isn't found in your pantry

    .env requirments to run the application properly:
    1. .env on clinet side:
        a. VITE_API_ACCESS to whatever your localhost is for python flask /api
    2. .env on server side:
        a. a database url connecting to MySql
            DATABASE_URL=
        b. a secret key
            SECRET_KEY=
        c. a client kroger id and clent secret associated with the CE public locations and products api
            KROGER_CLIENT_ID=
            KROGER_CLIENT_SECRET=
    
    Startup Instrcutions:
    1. Install dependencies 
        a. run the command 'npm i' in the client directory
        b. run the command 'pipenv install' in the server directory
    2. activate the virtual environment:
        a. run command 'pipenv shell' in the server directory
    3. set any environment variables needs in your .env the the server directory file to connect to your MySql and update the database
    4. run database migrations:
        b. run the command 'flask db upgrade' in the server directory
        a. I have included a sql script and a .mwb file in case this doesn't work properly, however, you should not need need them because of the migrations directory and versions directory associated with flask. this is a function of SqlAlchemy
    5. start the server and client
        a. run command 'npm run dev' in the client directory
        b. run the command 'python run.py' in the server directory

    API Testing:
        Note: Due to the public nature of the Kroger Certification Environment (CE) API, product search results tied to specific store locations may be temporarily unavailable. General product search without location ID remains functional. This is expected behavior during backend maintenance or environment resets.

