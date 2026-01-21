//|-----------------------------------------------------------------------------
//|            This source code is provided under the Apache 2.0 license      --
//|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
//|                See the project's LICENSE.md for details.                  --
//|           Copyright LSEG 202.       All rights reserved.                  --
//|-----------------------------------------------------------------------------

// Example Code Disclaimer:
// ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. LSEG MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE EXAMPLE CODE, OR THE INFORMATION, CONTENT, OR MATERIALS USED IN CONNECTION WITH THE EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE EXAMPLE CODE IS AT YOUR SOLE RISK.

// Type for RDP Auth Token (v1) request message
export type RDP_AuthToken_Type = {
    username: string
    password?: string
    grant_type: 'password' | 'refresh_token'
    takeExclusiveSignOnControl: any
    scope?: string
    client_id: string
    refresh_token?: string
}

// Type for RDP Auth Revoke Token (v1) request message
export type RDP_AuthRevoke_Type = {
    token: string
}

// Type for RDP Symbology Lookup request message
export type PDP_Symbology_Req_Type = {
    from: RDP_Symbology_From_Type[]
    to: RDP_Symbology_To_Type[]
    reference: string[]
    type: string
}

// sub-Type for RDP Symbology Lookup request message
export type RDP_Symbology_From_Type = {
    identifierTypes: string[]
    values: string[]
}

// sub-Type for RDP Symbology Lookup request message
export type RDP_Symbology_To_Type = {
    identifierTypes: string[]
}

// Type for RDP News Headline Table data
export type RDP_NewsHeadlines_Table_Type = {
    data: RDP_NewsHeadlines_Data_Type[]
}

// sub-Type for RDP News Headline Table data
export type RDP_NewsHeadlines_Data_Type = {
    storyId: string
    title: string
    versionCreated?: string
}

// Type for RDP Symbology Table data
export type RDP_Symbology_Table_Type = {
    data: RDP_Symbology_Data_Type[]
}

// sub-Type for RDP Symbology Table data
export type RDP_Symbology_Data_Type = {
    identifierType: string
    value: string
    name: string
    status: string
}