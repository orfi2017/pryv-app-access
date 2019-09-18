

# Access request app

## Phase 1

We can only request specific streams

### Expert authentifies

1. Enter pryv.hevs.ch credentials
2. obtain credentials
3. Then enter permissions that you wish to request from patients
4. generates link that you will send to patients

### Setup

1. Requested Permissions:

   https://myapp.whatever/?reqPermissions=XXX&someKey

   ```JSON
   [
       {
         "streamId": "diary",
         "level": "read",
         "defaultName": "Journal"
       },
       {
         "streamId": "position",
         "level": "contribute",
         "defaultName": "Position"
       }
   ]		
   ```

   `someKey` is used to store the obtained permissions on some backend where the expert is authenticated.

   Pryv.io, or something else.

### Open

1. [Auth request](https://api.pryv.com/reference/#auth-request)
2. open `response.body.url` in pop-up
3. start polling `response.body.poll` at the rate `response.body.poll_rate_ms`
4. When the user has accepted or refused, you will receive on the `poll` URL his credentials, or a refused message
5. You can stop polling
6. Your app needs to send these credentials in some backend (pryv.hevs.ch or other).



#### Example

Campaign manager app for pryv.me domain

https://camp.pryv.me/#/invitations/view/?campaignId=cjmho05qf000308p16qb948ax&hasSignIn=true



## Phase 2

We can query some semantic data such as `Heart` or `Weight`, without `streamId` knowledge

```json
[
	{	
		"streamId": "sempryv" // some stream at root level, or close
	}
]
```

Do the auth request as above, without sending the `username` and `token` credentials to the expert

### Streams discovery call

GET https://${username}.pryv.hevs.ch/streams

#### Headers

Authorization: ${token}

Receive

```
{
	streams: [
		// ...
	]
}
```

Look into streams for requested semantic annotations such as `Heart` and `Weight` 

If you find some, create a specific access for these streams only: [accesses.create](https://api.pryv.com/reference/#create-access):

```json
{
	"name": "for-expert-Dr.-something"
	"permissions": [
		{
			"streamId": "heart",
			"level": "read"
		}
	]
}
```



Store this on some backend pryv.hevs.ch or other