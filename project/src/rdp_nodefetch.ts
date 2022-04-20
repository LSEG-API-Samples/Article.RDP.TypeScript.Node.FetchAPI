//|-----------------------------------------------------------------------------
//|            This source code is provided under the Apache 2.0 license      --
//|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
//|                See the project's LICENSE.md for details.                  --
//|           Copyright Refinitiv 2022.       All rights reserved.            --
//|-----------------------------------------------------------------------------

// Example Code Disclaimer:
// ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. REFINITIV MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE EXAMPLE CODE, OR THE INFORMATION, CONTENT, OR MATERIALS USED IN CONNECTION WITH THE EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE EXAMPLE CODE IS AT YOUR SOLE RISK.
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { RDP_AuthToken_Type} from './rdp_types'
import { PDP_Symbology_Req_Type} from './rdp_types'
import { RDP_AuthRevoke_Type} from './rdp_types'


const rdpServer: string = process.env.RDP_BASE_URL || ''

const rdpAuthURL: string = process.env.RDP_AUTH_URL || ''
const rdpESGURL: string = process.env.RDP_ESG_URL || ''
const rdpSymbologyURL: string = process.env.RDP_SYMBOLOGY_URL || ''
const rdpAuthRevokeURL: string = process.env.RDP_AUTH_REVOKE_URL || ''
const rdpNewsURL: string = process.env.RDP_NEWS_URL || ''


const username: string = process.env.RDP_USERNAME || ''
const password: string = process.env.RDP_PASSWORD || ''
const client_id: string = process.env.RDP_APP_KEY || ''

const scope: string = 'trapi'
const takeExclusiveSignOnControl: boolean = true
let access_token: string = ''
let refresh_token: string = ''
let expires_in: string = ''

let symbol: string = 'IBM.N'

//const authenRDP = async (opt:RDP_AuthToken_Type) =>{
const authenRDP = async (_username: string, _password: string, _clientid: string, _refresh_token: string) => {
    const authenURL: string = `${rdpServer}${rdpAuthURL}`

    let authReq: RDP_AuthToken_Type = {
        'username': _username,
        'client_id': _clientid,
        'password': _password,
        'scope': scope,
        //'takeExclusiveSignOnControl': String(takeExclusiveSignOnControl),
        takeExclusiveSignOnControl,
        'grant_type': 'password',
    }

    if (_refresh_token.length !== 0) {
        authReq['refresh_token'] = _refresh_token,
            authReq['grant_type'] = 'refresh_token'
        delete authReq['scope']
        delete authReq['password']
    }

    //console.log(`authReq is ${JSON.stringify(authReq)}`)


    const response: Response = await fetch(authenURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(authReq)
    })

    if (!response.ok) {
        console.log('Authentication Failed')
        const statusText: string = await response.text()
        throw new Error(`HTTP error!: ${response.status} ${statusText}`);
    }
    console.log('Authentication Granted')
    //Parse response to JSON
    const authResponse = await response.json()
    access_token = authResponse.access_token
    refresh_token = authResponse.refresh_token
    expires_in = authResponse.expires_in
    // Define the timer to refresh our token 
    setRefreshTime()

}

const revokeRDPAuthen = async (access_token: string, _clientid: string) => {

    const authenURL = `${rdpServer}${rdpAuthRevokeURL}`

    const authReq: RDP_AuthRevoke_Type = {
        'token': access_token
    }

    const clientIDBase64: string = Buffer.from(`${client_id}:`).toString('base64')

    const response = await fetch(authenURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${clientIDBase64}`
        },
        body: new URLSearchParams(authReq)
    })

    if (!response.ok) {
        
        const statusText = await response.text()
        throw new Error(`HTTP error!: ${response.status} ${statusText}`);
    }

    console.log('Authentication Revoked')

}

const setRefreshTime = () => {

    const millis: number = (parseInt(expires_in) * 0.90) * 1000

    setInterval(async () => {
        try {
            await authenRDP(username, password, client_id, refresh_token)
        } catch (error) {
            console.log(error)
        }
    }, millis)
}

const requestSymbol = async (symbol: string, access_token: string) => {
    const symbologyURL: string = `${rdpServer}${rdpSymbologyURL}`

    const reqSymbolObj: PDP_Symbology_Req_Type = {
        'from': [{
            'identifierTypes': ['RIC'],
            'values': [symbol]
        }],
        'to': [{
            'identifierTypes': ['ISIN', 'LEI', 'ExchangeTicker']
        }],
        'reference': ['name', 'status', 'classification'],
        'type': 'auto'
    }

    // Send HTTP Request
    const response: Response = await fetch(symbologyURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify(reqSymbolObj)
    })

    if (!response.ok) {
        const statusText: string = await response.text()
        throw new Error(`HTTP error!: ${response.status} ${statusText}`);
    }
    //Parse response to JSON
    return await response.json()
}

const getNewsHeadlines = async (symbol: string, access_token: string, limit: number = 10) =>{
    const newsURL: string = `${rdpServer}${rdpNewsURL}?query=${symbol}&limit=${limit}`

    console.log(newsURL)

    // Send HTTP Request
    const response: Response = await fetch(newsURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    })

    if (!response.ok) {
        const statusText: string = await response.text()
        throw new Error(`HTTP error!: ${response.status} ${statusText}`);
    }
    //Parse response to JSON
    return await response.json()
    
}

const requestESG = async (symbol: string, access_token: string) => {
    const esgURL: string = `${rdpServer}${rdpESGURL}?universe=${symbol}`

    // Send HTTP Request
    const response: Response = await fetch(esgURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    })

    if (!response.ok) {
        const statusText: string = await response.text()
        throw new Error(`HTTP error!: ${response.status} ${statusText}`);
    }
    //Parse response to JSON
    return await response.json()
}

// Handle user press Ctrl+C while running the application.
process.on('SIGINT', async () => {
    console.log('Gracefully shutting down from Ctrl+C, calling RDP API Revoke service');

    try {

        await revokeRDPAuthen(access_token, refresh_token)

        // Waiting time for clean WebSocket connection
        setTimeout(() => {
            //graceful shutdown
            process.exit()
        }, 1000);

    } catch (error) {
        console.log(error)
    }

})

const main = async () => {
    console.log(`Running Main`)

    const argv = yargs(hideBin(process.argv))
        .option('symbol', {
            alias: 's',
            demandOption: false,
            default: 'IBM.N',
            describe: 'set up RIC Code',
            type: 'string'
        })
        .version('1.0.0')
        .example([
            ['$0 --symbol=RIC Code', '']
        ])
        .parseSync()
    symbol = argv.symbol

    try {

        await authenRDP(username, password, client_id, refresh_token)
        //console.log(access_token)

        if(access_token.length === 0 && refresh_token.length === 0 ){
            process.exit();
        }

        const esgData = await requestESG(symbol, access_token)
        console.log(esgData)

        const symbologyData = await requestSymbol(symbol, access_token)
        console.log(JSON.stringify(symbologyData))

        const newsHeadlineData = await getNewsHeadlines(symbol, access_token, 5)
        console.log(JSON.stringify(newsHeadlineData))
        

    } catch (error) {
        console.log(error)
        process.exit();
    }

}

main()