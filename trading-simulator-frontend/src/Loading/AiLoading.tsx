import { useState, useEffect} from 'react'
import './AiLoading.css'

export default function AiLoading(){

    return (
        <div aria-label='Loading Content' role="status" aria-live="polite" className='BarContainerAi'>
            <div className='BarAAi'></div>
            <div className='BarBAi'></div>
            <div className='BarCAi'></div>
            <div className='BarDAi'></div>
            <div className='BarEAi'></div>
        </div>
    )
}