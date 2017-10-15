define({ "api": [
  {
    "type": "get",
    "url": "/articles",
    "title": "Requests for accessing articles data",
    "sampleRequest": [
      {
        "url": "https://mu-hackathon.herokuapp.com/articles/:query"
      }
    ],
    "name": "GetArticles",
    "group": "Article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query",
            "description": "<p>Mongo Query String of the information requested</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>Url of the article</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Mongo ID of the object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the article</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "tags",
            "description": "<p>An array of tags, associated with the user who made them</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "domain",
            "description": "<p>Mongo DB pointer to the domain that it is attributed to</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "author",
            "description": "<p>Authors that have been attributed to the article</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"articles\": [\n    {\n      \"url\": \"money.cnn.com\",\n      \"id\": \"59e211106617b361f022b1b6\",\n      \"domains\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ],\n      \"articles\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ],\n      \"tags\": [\n        {\n          \"name\": \"goodSources\",\n          \"count\": 50,\n          \"snr\": 1.4\n        }\n      ]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingInformationError",
            "description": "<p>The information required to login was not present</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>The information submitted did not pass validation or was not found in the db</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The server encountered an error while processing the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"errors\": [\n    {\n      \"message\": \"Missing required values\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"errors\": [\n    {\n      \"message\": \"unauthorized\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"errors\": [\n    {\n      \"parameter\": \" mu-hackathon-server.users.$username_1 dup key\",\n      \"message\": \"E11000 duplicate key error index\",\n      \"value\": \" \\\"DeathwingX\\\" }\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mu-hackathon.herokuapp.com/authors?author=59e2123b3514724de446d050",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/articles.js",
    "groupTitle": "Article"
  },
  {
    "type": "patch",
    "url": "/articles",
    "title": "Requests for accessing articles data",
    "sampleRequest": [
      {
        "url": "https://mu-hackathon.herokuapp.com/articles"
      }
    ],
    "name": "PatchArticles",
    "group": "Article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>URL of the article to add</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the user that is adding the article</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "tags",
            "description": "<p>An array of strings consisting of the tags the user wants to add to the article</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingInformationError",
            "description": "<p>The information required to login was not present</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>The information submitted did not pass validation or was not found in the db</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The server encountered an error while processing the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"errors\": [\n    {\n      \"message\": \"Missing required values\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"errors\": [\n    {\n      \"message\": \"unauthorized\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"errors\": [\n    {\n      \"parameter\": \" mu-hackathon-server.users.$username_1 dup key\",\n      \"message\": \"E11000 duplicate key error index\",\n      \"value\": \" \\\"DeathwingX\\\" }\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "{\n  \"url\": \"http://www.foxnews.com/politics/2017/10/13/hillary-clinton-calls-trump-sexual-assaulter-in-bbc-interview-but-says-bills-behavior-in-past.html\",\n  \"id\": \"59e211106617b361f022b1b6\",\n  \"tags\": [\"goodSources\", \"prettyPicture\", \"highQuality\"]\n }",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/articles.js",
    "groupTitle": "Article"
  },
  {
    "type": "post",
    "url": "/articles",
    "title": "Requests for accessing articles data",
    "sampleRequest": [
      {
        "url": "https://mu-hackathon.herokuapp.com/articles"
      }
    ],
    "name": "PostArticles",
    "group": "Article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>URL of the article to add</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>Name of the author to attribute the article</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the user that is adding the article</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "tags",
            "description": "<p>An array of strings consisting of the tags the user wants to add to the article</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>Url of the article</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Mongo ID of the object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the article</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "tags",
            "description": "<p>An array of tags, associated with the user who made them</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "domain",
            "description": "<p>Mongo DB pointer to the domain that it is attributed to</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "author",
            "description": "<p>Authors that have been attributed to the article</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 CREATED\n{\n  \"articles\": [\n    {\n      \"url\": \"money.cnn.com\",\n      \"id\": \"59e211106617b361f022b1b6\",\n      \"domains\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ],\n      \"articles\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ],\n      \"tags\": [\n        {\n          \"name\": \"goodSources\",\n          \"count\": 50,\n          \"snr\": 1.4\n        }\n      ]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingInformationError",
            "description": "<p>The information required to login was not present</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>The information submitted did not pass validation or was not found in the db</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The server encountered an error while processing the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"errors\": [\n    {\n      \"message\": \"Missing required values\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"errors\": [\n    {\n      \"message\": \"unauthorized\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"errors\": [\n    {\n      \"parameter\": \" mu-hackathon-server.users.$username_1 dup key\",\n      \"message\": \"E11000 duplicate key error index\",\n      \"value\": \" \\\"DeathwingX\\\" }\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "{\n  \"url\": \"http://www.foxnews.com/politics/2017/10/13/hillary-clinton-calls-trump-sexual-assaulter-in-bbc-interview-but-says-bills-behavior-in-past.html\",\n  \"author\": \"Matt Bernardini\",\n  \"id\": \"59e211106617b361f022b1b6\",\n  \"tags\": [\"goodSources\", \"prettyPicture\", \"highQuality\"]\n }",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/articles.js",
    "groupTitle": "Article"
  },
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Request for login",
    "sampleRequest": [
      {
        "url": "https://mu-hackathon.herokuapp.com/auth/login"
      }
    ],
    "name": "Login",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of user logging in</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the user logging in</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Mongo ID of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "articles",
            "description": "<p>Articles the user has submitted tags for</p>"
          },
          {
            "group": "Success 200",
            "type": "Token",
            "optional": false,
            "field": "jwt",
            "description": "<p>JWT token used in the controlling access</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"user\": {\n    \"username\": \"JohnDoe\",\n    \"email\": \"valid@email.com\",\n    \"id\": \"59e211106617b361f022b1b6\",\n    \"articles\": [\n      \"59e2123b3514724de446d050\",\n      \"59e212cb84782e31a0208af5\"\n    ]\n  },\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZTM0NGRmZjExOWJkMWNjYzUwZjU1MiIsImFydGljbGVzIjpbX\n SwidXNlcm5hbWUiOiJEZWF0aHdpbmdYIiwiZW1haWwiOiJtYXR0LmJlcm5hcmRpbmlAZ21haWwuY29tIiwiX192IjowLCJpYXQiOjE1MDgwNjY1Mjcs\n ImV4cCI6MTUwODY3MTMyN30.fyTG6imgxHq7YlBOekzvPwi_kpT6AZ-XO7l0tT15RiU\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingInformationError",
            "description": "<p>The information required to login was not present</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>The information submitted did not pass validation or was not found in the db</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The server encountered an error while processing the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"errors\": [\n    {\n      \"message\": \"Missing required values\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"errors\": [\n    {\n      \"message\": \"unauthorized\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"errors\": [\n    {\n      \"parameter\": \" mu-hackathon-server.users.$username_1 dup key\",\n      \"message\": \"E11000 duplicate key error index\",\n      \"value\": \" \\\"DeathwingX\\\" }\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "[{application/json}] Signup",
        "content": "{\n  \"username\": \"JohnDoe\",\n  \"password\": \"password\"\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/signup",
    "title": "Request for signup",
    "sampleRequest": [
      {
        "url": "https://mu-hackathon.herokuapp.com/auth/signup"
      }
    ],
    "name": "Signup",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of user being added</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the user being added</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the user being added</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Mongo ID of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "articles",
            "description": "<p>Articles the user has submitted tags for</p>"
          },
          {
            "group": "Success 200",
            "type": "Token",
            "optional": false,
            "field": "jwt",
            "description": "<p>JWT token used in the controlling access</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 CREATED\n{\n  \"user\": {\n    \"username\": \"JohnDoe\",\n    \"email\": \"valid@email.com\",\n    \"id\": \"59e211106617b361f022b1b6\",\n    \"articles\": [\n      \"59e2123b3514724de446d050\",\n      \"59e212cb84782e31a0208af5\"\n    ]\n  },\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZTM0NGRmZjExOWJkMWNjYzUwZjU1MiIsImFydGljbGVzIjpbX\n SwidXNlcm5hbWUiOiJEZWF0aHdpbmdYIiwiZW1haWwiOiJtYXR0LmJlcm5hcmRpbmlAZ21haWwuY29tIiwiX192IjowLCJpYXQiOjE1MDgwNjY1Mjcs\n ImV4cCI6MTUwODY3MTMyN30.fyTG6imgxHq7YlBOekzvPwi_kpT6AZ-XO7l0tT15RiU\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>The information submitted did not pass validation</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The server encountered an error while processing the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"errors\": [\n    {\n      \"parameter\": \"username\",\n      \"message\": \"Please use only alphanumeric characters for username\",\n      \"value\": \"Ih@t3val1d@t1on\"\n    },\n    {\n      \"parameter\": \"email\",\n      \"message\": \"Please enter a valid email\",\n      \"value\": \"ihatevalidemails\"\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"errors\": [\n    {\n      \"parameter\": \" mu-hackathon-server.users.$username_1 dup key\",\n      \"message\": \"E11000 duplicate key error index\",\n      \"value\": \" \\\"DeathwingX\\\" }\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "[{application/json}] Signup",
        "content": "{\n  \"username\": \"JohnDoe\",\n  \"email\": \"valid@email.com\",\n  \"password\": \"password\"\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/authors",
    "title": "Requests for accessing authors data",
    "sampleRequest": [
      {
        "url": "https://mu-hackathon.herokuapp.com/authors/:query"
      }
    ],
    "name": "GetAuthors",
    "group": "Author",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query",
            "description": "<p>Mongo Query String of the information requested</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the author</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Mongo ID of the object</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "tags",
            "description": "<p>An array of tags, the number of times seen, and how accurate they are</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "articles",
            "description": "<p>Array of articles that the author has attributed to them</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "domains",
            "description": "<p>Domains the author has submitted articles for</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"authors\": [\n    {\n      \"name\": \"money.cnn.com\",\n      \"id\": \"59e211106617b361f022b1b6\",\n      \"domains\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ],\n      \"articles\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ],\n      \"tags\": [\n        {\n          \"name\": \"goodSources\",\n          \"count\": 50,\n          \"snr\": 1.4\n        }\n      ]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingInformationError",
            "description": "<p>The information required to login was not present</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>The information submitted did not pass validation or was not found in the db</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The server encountered an error while processing the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"errors\": [\n    {\n      \"message\": \"Missing required values\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"errors\": [\n    {\n      \"message\": \"unauthorized\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"errors\": [\n    {\n      \"parameter\": \" mu-hackathon-server.users.$username_1 dup key\",\n      \"message\": \"E11000 duplicate key error index\",\n      \"value\": \" \\\"DeathwingX\\\" }\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mu-hackathon.herokuapp.com/authors?author=59e2123b3514724de446d050",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/authors.js",
    "groupTitle": "Author"
  },
  {
    "type": "get",
    "url": "/domains",
    "title": "Requests for accessing domain data",
    "sampleRequest": [
      {
        "url": "https://mu-hackathon.herokuapp.com/domains/:query"
      }
    ],
    "name": "GetDomain",
    "group": "Domain",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query",
            "description": "<p>Mongo Query String of the information requested</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>FQDN of the domain</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Mongo ID of the object</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "articles",
            "description": "<p>Array of articles that the domain has attributed to them</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "authors",
            "description": "<p>Articles the user has submitted tags for</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"domains\": [\n    {\n      \"name\": \"www.foxnews.com\",\n      \"id\": \"59e211106617b361f022b1b6\",\n      \"articles\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ],\n      \"authors\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ]\n    },\n    {\n      \"name\": \"money.cnn.com\",\n      \"id\": \"59e211106617b361f022b1b6\",\n      \"articles\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ],\n      \"authors\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingInformationError",
            "description": "<p>The information required to login was not present</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>The information submitted did not pass validation or was not found in the db</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The server encountered an error while processing the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"errors\": [\n    {\n      \"message\": \"Missing required values\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"errors\": [\n    {\n      \"message\": \"unauthorized\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"errors\": [\n    {\n      \"parameter\": \" mu-hackathon-server.users.$username_1 dup key\",\n      \"message\": \"E11000 duplicate key error index\",\n      \"value\": \" \\\"DeathwingX\\\" }\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mu-hackathon.herokuapp.com/domains?author=59e2123b3514724de446d050",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/domains.js",
    "groupTitle": "Domain"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Requests for accessing user data",
    "sampleRequest": [
      {
        "url": "https://mu-hackathon.herokuapp.com/users/:query"
      }
    ],
    "name": "GetUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query",
            "description": "<p>Mongo Query String of the information requested</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Mongo ID of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "articles",
            "description": "<p>Articles the user has submitted tags for</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"users\": [\n    {\n      \"username\": \"JohnDoe\",\n      \"email\": \"valid@email.com\",\n      \"id\": \"59e211106617b361f022b1b6\",\n      \"articles\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ]\n    },\n    {\n      \"username\": \"JaneDoe\",\n      \"email\": \"valid2@email.com\",\n      \"id\": \"59e211106617b361f022b1b6\",\n      \"articles\": [\n        \"59e2123b3514724de446d050\",\n        \"59e212cb84782e31a0208af5\"\n      ]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MissingInformationError",
            "description": "<p>The information required to login was not present</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>The information submitted did not pass validation or was not found in the db</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>The server encountered an error while processing the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"errors\": [\n    {\n      \"message\": \"Missing required values\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"errors\": [\n    {\n      \"message\": \"unauthorized\",\n    }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"errors\": [\n    {\n      \"parameter\": \" mu-hackathon-server.users.$username_1 dup key\",\n      \"message\": \"E11000 duplicate key error index\",\n      \"value\": \" \\\"DeathwingX\\\" }\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i https://mu-hackathon.herokuapp.com/users?email~=valid",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "server/routes/users.js",
    "groupTitle": "User"
  }
] });
