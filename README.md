# pet-store
HW6 for 'Programming for the Web with JavaScript'. Build a Web API that lets apps
get information about pets and pet toys that the fictional store sells.
# Date Started: 4/4/2019
# Date Completed: TBD
# Learning Goals
- Create a web API using Node.js and MongoDB
- Create a Node Express app
- Use JS queries via Mongoose to retrieve data from a MongoDB database
- Create first server side app
# Tech Stack
- JavaScript
- Node.js
- Express
- MongoDB
- Mongoose
# File Descriptions
- index.js: home page, all routes are here
- Animal.js: Provided by course, defines the Animal schema.
- Toy.js:  Provided by course, defines the Toy schema.
# ToDo
- [X] Find a way to populate the database so I have something to work with.
Implement 4 APIs.
- [ ] /findToy       finds and returns the toy by id
    Example usage: /findToy?id=1234
- [] /findAnimals   Finds animals that match species, gender, and trait. Complete
    matches only. If one of these parameters is omitted it should be ignored.
    Example usage: /findAnimals?species=Dog&trait=loyal&gender=female
- [] /animalsYoungerThan Finds animals whose age is less than the parameter.
    Example usage: /animalsYoungerThan?age=12
- [] /calculatePrice  Calculates the price of the Toys with the corresponding ids
    using specified quantities.
    Example usage: /calculatePrice?id[0]=123&qty[0]=2&id[1]=456&qty[1]=3
