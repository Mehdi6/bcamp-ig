# bcamp-ig

## Tech
	- MongoDB
	- NodeJS
	- ExpressJS
	- ReactJs

## Database schema

+User
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

+Post
	- id
	- content
	- id_parent_post
	- created_at

+Reaction
	- post_id
	- creation_date
	- reaction (h/sa/sm/su/l)


## Rest API schema
	+ follow | POST | input username output true/false
	+ unfollow | POST | input username output true/false
	+ create_account  | POST |
		-form subscription: input: (form: fullname/ username/ age/ password/ etc ) / output: 
		-form validate_email: input code_validation | output: true/false

	+ authenticate | POST | input: (credentials: username/password)  / output:  true/false
	+ share_a_post | POST | input descrption/link/text
	+ list_of_followers | GET | input: username/id = output: list following
	+ list_of_followed | GET | input: username | output: list followers
	+ search_user | GET | input: username = output: list users
	+ list_of_comments | GET | input: post_id | output: list of comments
	+ my_profile | GET | input: | output: profile (fullname, pict, etc | posts )
	+ list_posts | GET | input: | output: posts (of followers ranked by created_at)
	+ react_to_post | POST | input: post_id reaction (...) | output: true/false


## Maquette

i) Timeline
	post1 (user_avat, reactions_count, content)
		prev: comment

	post2 (...)


	post3 (...)


ii) Profile
	profile_picture(embeded:link)

	bio

	followers_count (embeded_link_to_followers_list)
	following_count (embeded_link_to_following_list)

	posts
		post1 (user_avat, reactions_count, content)
			prev: comment

		post2 (...)

		post3 (...)
		
		...


iii) Add post
	Form
		+ content
		+ title
		+ link (media/picture/article)
		+ upload (media/picture)

	button (share)
	
iv) Home (signup/signin)

	welcome --> Sign IN | Sign UP

v)	Sign IN (Interface)
	form:
		- (username/email + password)
		- (forgot pwd)

vi) Sign Up (Interface)
	form
		- fullname
		- username
		- pssword1/2
		- etc

## Done
###Rest API (BackEnd)
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

	(Learn how to handle authentication with Node using Passport.js)[https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e]
	