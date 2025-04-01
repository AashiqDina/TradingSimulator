import { useState, useEffect} from 'react'
import './Loading.css'

export default function Loading(){

    return (
        <div className='BarContainer'>
            <h2>Loading</h2>
            <div className='BarA'></div>
            <div className='BarB'></div>
            <div className='BarC'></div>
            <div className='BarD'></div>
            <div className='BarE'></div>
        </div>
    )
}