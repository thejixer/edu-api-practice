
const endpoints = [
  // ### User Section ###
  // sign up
  {
    endpoint: 'http://localhost:4000/user/signup',
    method: 'POST',
    body: {
      username: String,
      name: String
    },
    requiresAuth: false,
    possibleErrors: [
      {
        error: 'bad input',
        reason: 'you probably forgot to give the required params or misspeled something'
      },
      {
        error: 'this username already exists in the database',
        reason: 'self explanatory'
      }
    ],
    response: {
      token: String
    },
    notes: [
      'you should store this token somewhere eg. cookies'
    ]
  },
  // login
  {
    endpoint: 'http://localhost:4000/user/login',
    method: 'POST',
    body: {
      username: String,
      password: String
    },
    requiresAuth: false,
    possibleErrors: [
      {
        error: 'bad input',
        reason: 'you probably forgot to give the required params or misspeled something'
      },
      {
        error: 'bad request: no such user exists',
        reason: 'self explanatory'
      },
      {
        error: 'password doesnt match',
        reason: 'self explanatory'
      }
    ],
    response: {
      token: String
    },
    notes: [
      'you should store this token somewhere eg. cookies'
    ]
  },
  // me
  {
    endpoint: 'http://localhost:4000/user/me',
    method: 'POST',
    body: {},
    requiresAuth: true,
    possibleErrors: [
      {
        error: 'Unathorized',
        reason: 'you probably didnt send the token in the currect form in the header'
      }
    ],
    response: {
      _id: 'userId',
      ...rest
    },
    notes: [
      'in order to check if this is successful or not, u should check if the response contains the field _id'
    ]
  },
  // edit User
  {
    endpoint: 'http://localhost:4000/user/edit',
    method: 'POST',
    body: {
      name: String,
      bio: {
        type: String,
        maxLength: 200
      }
    },
    requiresAuth: true,
    possibleErrors: [
      {
        error: 'Unathorized',
        reason: 'you probably didnt send the token in the currect form in the header'
      },
      {
        error: 'bad input',
        reason: 'you probably forgot to give the required params or misspeled something'
      },
    ],
    response: {
      msg: 'ok'
    },
  },
  // get all users
  {
    endpoint: 'http://localhost:4000/user/',
    method: 'GET',
    requiresAuth: false,
    response: 'a list of users in form of an array'
  },
  // get single user by id
  {
    endpoint: 'http://localhost:4000/user/singleUser/:_id',
    method: 'GET',
    requiresAuth: false,
    possibleErrors: [
      {
        error: 'bad request: no such user exists',
        reason: 'u probably sent an incorrect id'
      },
      
    ],
    response: 'returns a user'
  },
  // get top writers
  {
    endpoint: 'http://localhost:4000/user/top-users',
    method: 'GET',
    requiresAuth: false,
    response: 'returns a list of top users based on their average score'
  },
  // update avatar (upload image to server)
  {
    endpoint: 'http://localhost:4000/user/update-avatar',
    method: 'POST',
    body: 'formdata(avatar)',
    requiresAuth: true,
    codeSnippet: `
      const submitAvatar = async () => {
        try {
          
          if (!file) return
    
          console.log(file)
    
          const formData = new FormData()
          formData.append('avatar', file)
    
          fetch('http://localhost:4000/user/update-avatar', {
            method: 'POST',
            headers: {
              'auth': 'ut eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxNjUxNTE3NzIwNjI4NjA2NTQ2IiwiaWF0IjoxNjUxNTIyOTg3fQ.r9HsxWH_C7oRx9veQYMCDAfw4coE8ldVc1I9CfZBssw'
            },
            body: formData
          }).then(res => {
            console.log(res)
          })
    
        } catch (error) {
          console.log('lol')
        }
      }
    `,
    possibleErrors: [
      {
        error: 'somethings wrong',
        reason: 'u probably forgot to send correct headers'
      },
      
    ],
    response: {
      msg: 'ok'
    }
  },

  // ### Blog Section ###
  // submit new blog
  {
    endpoint: 'http://localhost:4000/blog/write',
    method: 'POST',
    body: {
      title: String,
      content: String, // a string in form of html which is the output of wysiwyg, example ==> '<div><h1> hello i am a blog </h1></div>'
      imgurl: String // this is the main picture of the article which u display in lists
    },
    requiresAuth: true,
    possibleErrors: [
      {
        error: 'Unathorized',
        reason: 'you probably didnt send the token in the correct form in the header'
      },
      {
        error: 'bad request: bad inputs',
        reason: 'you probably forgot to give the required params or misspeled something'
      },
    ],
    response: {
      msg: 'ok',
      _id: String
    },
    notes: [
      "the _id returned in the resposne is the id of newly created blog which u can navigate to using it"
    ]
  },
  // get a list of all blogs
  {
    endpoint: 'http://localhost:4000/blog',
    method: 'GET',
    requiresAuth: false,
    response: 'returns a list of blogs'
  },
  // get my blogs
  {
    endpoint: 'http://localhost:4000/blog/my-blogs',
    method: 'GET',
    requiresAuth: true,
    response: 'a list of blogs that the current user has created'
  },
  // get a single blog by id
  {
    endpoint: 'http://localhost:4000/blog/single-blog/:_id',
    method: 'GET',
    requiresAuth: false,
    possibleErrors: [
      {
        error: 'bad request: no such blog exists',
        reason: 'self explanatory'
      }
    ],
    response: 'returns the blog based on the id u sent to the server'
  },
  // get a list of blogs of a specefic user
  {
    endpoint: 'http://localhost:4000/blog/by-user',
    method: 'POST',
    requiresAuth: false,
    body: {
      _id: String // this is the id of the user u want to get blogs of
    },
    possibleErrors: [
      {
        error: 'bad request: no such user exists',
        msg: 'self explanatory'
      }
    ],
    response: 'a list of blogs',
  },
  // edit a blog 
  {
    endpoint: 'http://localhost:4000/blog/edit',
    method: 'POST',
    requiresAuth: true,
    // please note: the data field is the same as create blog 
    body: {
      blogId: String, // the id of the blog u want to edita
      data: {
        title: String,
        content: String,
        imgurl: String
      }
    },
    possibleErrors: [
      {
        error: 'bad request: bad inputs',
        reason: 'you probably forgot to give the required params or misspeled something'
      },
      {
        error: 'unathorized',
        reason: 'u probably forgot to send the headers in the correct format'
      }
    ]
  },
  // rate a blog
  {
    endpoint: 'http://localhost:4000/blog/submit-rate',
    method: 'POST',
    requiresAuth: true,
    body: {
      blogId: String, // the id of the blog which u want to submit a score,
      score: Number, // the actual score u want to give: 1-5
    },
    possibleErrors: [
      {
        error: 'bad request: bad input',
        reason: 'you probably forgot to give the required params or misspeled something'
      },
      {
        error: 'bad request: no such blog exists',
        reason: 'self explanatory'
      },
      {
        error: 'unathorized',
        reason: 'u probably forgot to send the headers in the correct format'
      }
    ],
    response: {
      msg: 'ok'
    }
  },
  // top blogs
  {
    endpoint: 'http://localhost:4000/blog/top-blogs',
    method: 'GET',
    requiresAuth: false,
    response: 'returns a list of top blogs based on their average score'
  },
  // ### Comment Section ###
  {
    endpoint: 'http://localhost:4000/comment/submit',
    method: 'POST',
    requiresAuth: true,
    body: {
      text: String,
      blogId: String
    },
    possibleErrors: [
      {
        error: 'bad request: bad inputs',
        reason: 'you probably forgot to give the required params or misspeled something'
      },
      {
        error: 'unathorized',
        reason: 'u probably forgot to send the headers in the correct format'
      },
      {
        error: 'bad request: no such blog found',
        reason: 'self explanatory'
      }
    ],
    response: {
      msg: 'ok'
    }
  },
  {
    endpoint: 'http://localhost:4000/comment/by-blog/:blogId',
    method: 'GET',
    requiresAuth: false,
    possibleErrors: [
      {
        error: 'bad request: no such blog exists',
        reason: 'self explanatory'
      }
    ],
    response: 'a list of comments'
  }


]