import { useState, useEffect} from 'react'
import './Loading.css'

export default function Loading(){

    return (
        <div role="status" aria-live="polite" className='BarContainer'>
            <h2>Loading</h2>
            <div className='BarA'></div>
            <div className='BarB'></div>
            <div className='BarC'></div>
            <div className='BarD'></div>
            <div className='BarE'></div>
        </div>
    )
}