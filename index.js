const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('fcm-d977e-firebase-adminsdk-icoe6-71ab0496a6.json')
const databaseURL = 'https://fcm-d977e.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-d977e/messages:send'
const deviceToken =
  'cjvo1NAaW8xiDV2gaubRbn:APA91bE6s-CC9-i7X1d2wxxhqUFlzS5AHaIm0iQzWxLQQajQm-cPcd05tynAAx4RfTZs-HwTLhxQrMNnVLRGrfsKTi2BY3myPVlDRSmySHxAxi7sINJC9QKk2_xlxguydLprz53Xkg7d'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()