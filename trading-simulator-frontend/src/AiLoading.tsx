import { useState, useEffect} from 'react'
import './AiLoading.css'

export default function AiLoading(){

    return (
        <div role="status" aria-live="polite" className='BarContainer'>
            <div className='BarA'></div>
            <div className='BarB'></div>
            <div className='BarC'></div>
            <div className='BarD'></div>
            <div className='BarE'></div>
        </div>
    )
}