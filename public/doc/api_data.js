define({ "api": [
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
  }
] });
