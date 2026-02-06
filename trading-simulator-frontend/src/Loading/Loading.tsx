import { useState, useEffect} from 'react'
import './Loading.css'

export default function Loading(props: any){
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [dots, setDots] = useState<string>(".") 

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(!props.scale){
                setShowMessage(true)
            }
        }, 5000);

       return () => clearTimeout(timeout)
    }, [])

    useEffect(() => {
        if(showMessage){
            const interval = setInterval(() => {
                (dots.length >= 3) ? setDots(".") : setDots(dots + ".")
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [dots])

    return (
        <>
            <div aria-label='Loading Content' data-testid="loading" style={{ transform: `scale(${props.scale || 1})`, marginBottom: `${props.marginBottom || 0.7}rem`, height: `${props.height || "85"}vh` }} role="status" aria-live="polite" className='BarContainer'>
                <div className='BarA'></div>
                <div className='BarB'></div>
                <div className='BarC'></div>
                <div className='BarD'></div>
                <div className='BarE'></div>
                <p className='LongLoadingMessage' style={showMessage ? {opacity: 1, top: `${props.top || 17}rem`} : undefined}>This app uses on-demand hosting, so the first request may take a minute{dots}</p>
            </div>
        </>
    )
}