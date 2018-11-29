# bcamp-ig

## Tech
	- MongoDB
	- NodeJS
	- ExpressJS
	- ReactJs

## Database schema

- User
	- profile_username
	- fullname
	- password
	- age
	- profile_picture
	- bio
	- link
	- followers[]
		-id
	- following[]
		-id
	- created_at

- Post
	- id
	- description
	- id_parent_post
	- created_at

- Reaction
	- post_id
	- creation_date
	- reaction (h/sa/sm/su/l)


## Rest API schema
* follow | POST | input username output true/false
* unfollow | POST | input username output true/false
* create_account  | POST |
	* form subscription: input: (form: fullname/ username/ age/ password/ etc ) / output: 
	* form validate_email: input code_validation | output: true/false
	
* authenticate | POST | input: (credentials: username/password)  / output:  true/false
* share_a_post | POST | input descrption/link/text
* list_of_followers | GET | input: username/id = output: list following
* list_of_followed | GET | input: username | output: list followers
* search_user | GET | input: username = output: list users
* list_of_comments | GET | input: post_id | output: list of comments
* my_profile | GET | input: | output: profile (fullname, pict, etc | posts )
* list_posts | GET | input: | output: posts (of followers ranked by created_at)
* react_to_post | POST | input: post_id reaction (...) | output: true/false


## Maquette

1. Timeline
	1. post1 (user_avat, reactions_count, content)
		prev: comment
	2. post2 (...)
	3. post3 (...)


2. Profile
	1. profile_picture(embeded:link)
	2. bio
	3. followers_count (embeded_link_to_followers_list)
	4. following_count (embeded_link_to_following_list)
	5. posts
		1. post1 (user_avat, reactions_count, content)
			prev: comment	
		2. post2 (...)
		3. post3 (...)

3) Add post
	1. Form
		1. content
		2. title
		3. link (media/picture/article)
		4. upload (media/picture)

	2. button (share)
	
4. Home (signup/signin)

	welcome --> Sign IN | Sign UP

5. Sign IN (Interface)
form:
	1.(username/email + password)
	2.(forgot pwd)

6. Sign Up (Interface)
form:
	1. fullname
	2. username
	3. pssword1/2
	4. etc

## Done

### Rest API (BackEnd)
- user create account
- user authenticate

### Web interface (FrontEnd)
	(void)

## Features
- user create account
- user authenticate
- user add/remove post/comment
- user follow/unfollow other users
- posts, are content, media/pictures/videos/links/etc
- posts might have, comments, likes, and likes on comments

## Resources we got inspired from

* [Learn how to handle authentication with Node using Passport.js](https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e)
	
