# Todo-REST-api

Users:

create new user:
POST '/users' {
    "user_name": "user_name",
    "user_email":"user_email",
    "user_password":"user_password"
}

user login:
POST '/signin' {
    "user_email":"user_email",
    "user_password":"user_password"
} -> in the response you will get a TOKEN, for further requests provide it in the header as:
authorization: bearer TOKEN


Refresh Token:
POST '/refresh' { // header -> Authorization: bearer <REFRESH_TOKEN>

}


update user:
PATCH '/' {
"user_name":"user_name",
"user_email":"user_email",
"user_id":"user_id"
}




Groups:
Headers:
Authorization: bearer TOKEN

create new group:
POST '/users/groups' {
    "group_name": "group_name"
}

update group:
PATCH '/users/groups' {
    "group_name": "group_name",
    "group_id": "group_id"
}

delete group:
DELETE '/users/groups' {
    "group_id": "group_id"
}

add users to group"

POST '/users/groups/newgroupuser' {
    "group_id":"group_id",
    "user_id":"user_id"
}

delete users from group:

delete '/users/groups/deleteuser' {
    "group_id":"group_id",
    "user_id":"user_id"
}


