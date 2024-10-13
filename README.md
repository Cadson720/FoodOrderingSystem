/backend main functionality is completed through the app.js file. This connects each of our own locally hosted mysql db
/frontend/src contains all frontend source code, only the styles implemented by Ethan were placed within the styles folder, the .js and .css files are jumpled within the /src folder
/cypress/e2e contains our unit tests which are run through the azure pipeline
azure-pipelines.yml is located within the main directory

By Raymond: The repository has three parts. The first one is the frontend part, which contains react and npm. The second one is the backend part, which contains node.js and the database setup code. The third one is Cypress, which is used for automatic testing. Raymond is in charge of part of the App.js, most parts of the App.css, index.ts, and all parts of Inventory.js and Payment.js in the front end. In the backend, Raymond is in charge of the payment, inventory, and menu APIs and creates the whole app.js template for everyone to use. For the Cypress test, Raymond did the setup of the Cyrpess, cypress.config.js and Payment.spec.js To use Raymond's Payment function, the user needs to have valid payment details so the payment can continue. After the payment is submitted, the cart detail will create an order. To use Raymond's Inventory function, the user can add items, modify items and delete items by easily following the instructions on the webpage.

By Ethan: I did the iniitial configuration of the repository. Setting up the node.js and react project. In chronological order I completed.:

backend/app.js app.get for menu table and /menu/:id are the get requests for my menu feature
cypress/e2e/menu/signin_menu_detail.cy.js
sourcing and implementation of all images in the /frontend/public dir
azure-pipelines.yml configuration was partially my doing with Ray
styles/Menu.css is used to style my Menu.js page
styles/MenuItemDetail.css is used to style the page made as a result of clicking on each menu item within Menu.js
/src/Menu.js and /src/MenuItemDetail.js were implemented by Ethan, which link to the backend through get requests in the app.js file in the backend dir
App.css navbar styles are my work

By Xi: I was in charge of search functions and order management. I edit part of app.js in the backend to get/update/delete data in orders. I created order.js and orderdetail.js in the front end to display the UI, and I made order.css to style both the order page and the order detail page. I edit a small part of menu.js to search items via a filter. I edit a small portion of app.js in the frontend folder to import order and order details in the navigation. To use my search functions, input any letter in the search box to filter and find an item in the menu. To search order, you need to select a date and input an order ID in the search box, if you input a non-integer symbol in the search box, your search will fail. You can delete orders or edit their details on the order page.
