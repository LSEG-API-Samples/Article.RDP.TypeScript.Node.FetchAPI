//|-----------------------------------------------------------------------------
//|            This source code is provided under the Apache 2.0 license      --
//|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
//|                See the project's LICENSE.md for details.                  --
//|           Copyright Refinitiv 2022.       All rights reserved.            --
//|-----------------------------------------------------------------------------

// Example Code Disclaimer:
// ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. REFINITIV MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE EXAMPLE CODE, OR THE INFORMATION, CONTENT, OR MATERIALS USED IN CONNECTION WITH THE EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE EXAMPLE CODE IS AT YOUR SOLE RISK.

export type RDP_AuthToken_Type = {
    username: string
    password?: string
    grant_type: 'password' | 'refresh_token'
    takeExclusiveSignOnControl: any
    scope?: string
    client_id: string
    refresh_token?: string
}

export type RDP_AuthRevoke_Type = {
    token: string
}

export type PDP_Symbology_Req_Type = {
    from: RDP_Symbology_From_Type[]
    to: RDP_Symbology_To_Type[]
    reference: string[]
    type: string
}

export type RDP_Symbology_From_Type = {
    identifierTypes: string[]
    values: string[]
}

export type RDP_Symbology_To_Type = {
    identifierTypes: string[]
}

export type RDP_NewsHeadlines_Table_Type = {
    data: RDP_NewsHeadlines_Data_Type[]
}

export type RDP_NewsHeadlines_Data_Type = {
    storyId: string
    title: string
    versionCreated: string
}