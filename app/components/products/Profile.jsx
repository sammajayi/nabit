import React from 'react'
import {
    Name,
    Avatar,
    EthBalance,
  } from "@coinbase/onchainkit/identity";


export default function Profile({ address = "", soldCount = 0, boughtCount = 0 }) {
    return (
        <div className="w-full max-w-md mx-auto px-4 py-3 bg-white">
        <div className="flex flex-col items-center p-6 rounded-2xl shadow-md">
          
            <div className="mb-4">
                <Avatar address={address} size={64} />
            </div>
            <div className="mb-2 font-bold text-lg">
                <Name address={address} />
            </div>
           
            <div className="mb-4">
                <EthBalance address={address} className="text-blue-600 font-mono" />
            </div>
            {/* Stats */}
            <div className="flex gap-8">
                <div className="flex flex-col items-center">
                    <span className="font-bold text-xl text-black">{soldCount}</span>
                    <span className="text-xs text-gray-500">Sold</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-xl text-black">{boughtCount}</span>
                    <span className="text-xs text-gray-500">Bought</span>
                </div>
            </div>
        </div>
        </div>
    )
}