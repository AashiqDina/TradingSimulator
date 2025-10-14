import { useState, useEffect} from 'react'
import './Loading.css'

export default function Loading(){

    return (
        <div style={{scale: 2}} role="status" aria-live="polite" className='BarContainer'>
            <div className='BarA'></div>
            <div className='BarB'></div>
            <div className='BarC'></div>
            <div className='BarD'></div>
            <div className='BarE'></div>
        </div>
    )
}