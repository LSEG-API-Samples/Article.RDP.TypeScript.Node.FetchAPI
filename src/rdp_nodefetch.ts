//|-----------------------------------------------------------------------------
//|            This source code is provided under the Apache 2.0 license      --
//|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
//|                See the project's LICENSE.md for details.                  --
//|           Copyright Refinitiv 2022.       All rights reserved.            --
//|-----------------------------------------------------------------------------

// Example Code Disclaimer:
// ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. REFINITIV MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE EXAMPLE CODE, OR THE INFORMATION, CONTENT, OR MATERIALS USED IN CONNECTION WITH THE EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE EXAMPLE CODE IS AT YOUR SOLE RISK.

// Importing NPM packages
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
// Importing Types
import { RDP_AuthToken_Type} from './rdp_types'
import { PDP_Symbology_Req_Type} from './rdp_types'
import { RDP_AuthRevoke_Type} from './rdp_types'
import { RDP_NewsHeadlines_Table_Type } from './rdp_types'
import { RDP_Symbology_Table_Type } from './rdp_types'

// RDP APIs endpoints
const rdpServer: string = process.env.RDP_BASE_URL || ''
const rdpAuthURL: string = process.env.RDP_AUTH_URL || ''
const rdpSymbologyURL: string = process.env.RDP_SYMBOLOGY_URL || ''
const rdpAuthRevokeURL: string = process.env.RDP_AUTH_REVOKE_URL || ''
const rdpNewsURL: string = process.env.RDP_NEWS_URL || ''

// RDP Credentials
const username: string = process.env.RDP_USERNAME || ''
const password: string = process.env.RDP_PASSWORD || ''
const client_id: string = process.env.RDP_APP_KEY || ''

const scope: string = 'trapi'
const takeExclusiveSignOnControl: boolean = true
// Access Token Information
let access_token: string = ''
let refresh_token: string = ''
let expires_in: string = ''

let symbol: string = 'LSEG.L'
let newsLimit: number = 10

// Send HTTP Post request to get Access Token (Password Grant and Refresh Grant) from RDP Auth Service
const authenRDP = async (_username: string, _password: string, _clientid: string, _refresh_token: string) => {
    const authenURL: string = `${rdpServer}${rdpAuthURL}`

    //Init Authentication Resquest Message and First Login scenario
    let authReq: RDP_AuthToken_Type = {
        'username': _username,
        'client_id': _clientid,
        'password': _password,
        'scope': scope,
        //'takeExclusiveSignOnControl': String(takeExclusiveSignOnControl),
        takeExclusiveSignOnControl,
        'grant_type': 'password',
    }

    //For the Refresh_Token scenario
    if (_refresh_token.length !== 0) {
        authReq['refresh_token'] = _refresh_token,
            authReq['grant_type'] = 'refresh_token'
        delete authReq['scope']
        delete authReq['password']
    }

    //console.log(`authReq is ${JSON.stringify(authReq)}`)

    // Send HTTP Request
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
    //Set Token Information
    access_token = authResponse.access_token
    refresh_token = authResponse.refresh_token
    expires_in = authResponse.expires_in
    // Define the timer to refresh our token 
    setRefreshTime()

}

// Send Authentication Revoke Request message to RDP Auth Service
const revokeRDPAuthen = async (access_token: string, _clientid: string) => {

    const authenURL = `${rdpServer}${rdpAuthRevokeURL}`

    const authReq: RDP_AuthRevoke_Type = {
        'token': access_token
    }

    const clientIDBase64: string = Buffer.from(`${client_id}:`).toString('base64')

    // Send HTTP Request
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

//Send a Refresh Grant message before Access Token's expires (expires_in time)
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

// Request Symbology Lookup Data from RDP Symbology Lookup Service
const requestSymbol = async (symbol: string, access_token: string) => {
    const symbologyURL: string = `${rdpServer}${rdpSymbologyURL}`

    console.log(`Requesting Symbology data from ${symbologyURL}`)

    // Create POST requst message
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
        throw new Error(`Get Symbology HTTP error!: ${response.status} ${statusText}`);
    }
    console.log('Get Symbology data success.')
    //Parse response to JSON
    return await response.json()
}

// Request News Headlines Data from RDP News Service
const getNewsHeadlines = async (symbol: string, access_token: string, limit: number = 10) =>{
    const newsURL: string = `${rdpServer}${rdpNewsURL}?query=${symbol}&limit=${limit}`

    console.log(`Requesting News Headlines from ${newsURL}`)

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
        throw new Error(`Get News Headlines HTTP error!: ${response.status} ${statusText}`);
    }
    console.log('Get News Headlines data success.')
    //Parse response to JSON
    return await response.json()
    
}

// Handle user press Ctrl+C while running the application.
process.on('SIGINT', async () => {
    console.log('Gracefully shutting down from Ctrl+C, calling RDP API Revoke service');

    try {

        await revokeRDPAuthen(access_token, refresh_token)

        setTimeout(() => {
            //graceful shutdown
            process.exit()
        }, 1000);

    } catch (error) {
        console.log(error)
    }

})

// Convert News Headline JSON data to be a table
const displayNewsHeadlines = (newsJSON:any) => {
    const newsData: any = newsJSON['data']
    let newsItem:any = undefined

    //If no news data
    if(newsData.length === 0){
        return console.log('No news data for this query')
    }

    const newsHeadlinesTable: RDP_NewsHeadlines_Table_Type = { data: [] }

    newsData.forEach((headline:any) => {
        newsItem = headline['newsItem']

        //console.log(`News Headline is ${newsHeadlines}\n`)
        //console.log(`storyId = ${headline['storyId']} and versionCreated =  ${newsVersionCreated}`)

        newsHeadlinesTable['data'].push({
            'storyId': headline['storyId'],
            'title': newsItem['itemMeta']['title'][0]['$'],
            'versionCreated': newsItem['itemMeta']['versionCreated']['$']
        })
    })
    console.table(newsHeadlinesTable['data'])
}

// Convert Symbology JSON data to be a table
const displaySymbology = (symbologyJSON:any) => {

    const symbologyData: any = symbologyJSON['data']
    const symbologyOutput: any  = symbologyData[0]['output']

    //If the convertion result is error or empty
    if(symbologyOutput.length === 0 || symbologyData[0].hasOwnProperty('errors')){
        return console.log(`Error: ${symbologyData[0]['errors'][0]} (${symbologyData[0]['input'][0]['value']})`)
    }

    const symbologyTable: RDP_Symbology_Table_Type = { data: [] }
    symbologyOutput.forEach(({identifierType,value, name, status }:any)=>{
        symbologyTable['data'].push({
            identifierType,
            value,
            name,
            status
        })
    })

    console.log(`Input Symbol = ${symbologyData[0]['input'][0]['value']} type = ${symbologyData[0]['input'][0]['identifierType']}`)
    console.log('Converted Identifiers:')
    console.table(symbologyTable['data'])
    
}

// ---------------- Main Function ---------------------------------------- //
const main = async () => {

    console.log(`Running RDP Node.js example application`)

    //Getting command line arguments
    const argv = yargs(hideBin(process.argv))
        
        .option('symbol', {
            alias: 's',
            demandOption: false,
            default: 'LSEG.L',
            describe: 'set up RIC Code',
            type: 'string'
        })
        .option('newslimit', {
            alias: 'l',
            demandOption: false,
            default: 10,
            describe: 'set up News Headlines count',
            type: 'number'
        })
        .version('1.0.0')
        .example([
            ['node --experimental-fetch $0 --symbol=RIC Code --newslimit=5', '']
        ])
        .parseSync()

    symbol = argv.symbol
    newsLimit = argv.newslimit

    try {

        //Send authentication request
        await authenRDP(username, password, client_id, refresh_token)
        //console.log(access_token)

        if(access_token.length === 0 && refresh_token.length === 0 ){
            console.log('Error, exit the application')
            process.exit();
        }

        const symbologyData = await requestSymbol(symbol, access_token)
        //console.log(JSON.stringify(symbologyData))
        displaySymbology(symbologyData)

        const newsHeadlineData = await getNewsHeadlines(symbol, access_token, newsLimit)
        //console.log(JSON.stringify(newsHeadlineData))
        displayNewsHeadlines(newsHeadlineData)
        

    } catch (error) {
        console.log(error)
        process.exit();
    }

}

// Running the application
main()