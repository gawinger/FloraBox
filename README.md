# FloraBox
Online store imitation on the example of a florist with full functionality except for payments. \
This is my most extensive project so far. I plan on running it soon as a true online florist. \

## Used technologies
Project is created using **javascript** and **node.js** with **express.js**.\
It uses **mongoDB** with **mongoose** to store data about users and products.

## Functionality
I constantly add functionality to this website to provide best user experience. So far I added:
  - using Sharp and Multer modules to resize images on upload and storing them as thumbnails and regular images to speed up webiste loading,
  - user authentication created with passport.js,
  - user authorization and admin accounts that can add and edit products,
  - user accounts able to store address information that will improve shopping experience,
  - products pagination to improve loading speed,
  - user friendly option allowing them to choose how many products should appear on one page,
  - cart functionality that is rensponsible for showing products in cart and actual value of the cart,
  - breakdown of products by type, categories and occasions,
  - marking products on sale with the end date of the promotion,
  - bouquet creator enabling users to create their own compositions,
  - product image zoom functionality.

Additionally, I try to keep the project protected against the most common security issues like cross site scripting or HTML injection.

View Live: https://florabox.bartoszczupryna.com/
