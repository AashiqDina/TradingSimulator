import { useEffect } from "react";
import AiLoading from "../AiLoading"
import React from "react";

export default function AiChat(props: any){

  useEffect(() => {
    const container = document.getElementById('Chat');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [props.UserPrompts, props.AiResponses]);

    return (
        <>
            <article className='ChatDisplayed'>
                    <div id='Chat' className='Chat'>
                      { props.UserPrompts.map((UserPrompts: any, index: number) => (
                        <React.Fragment key={index}>
                          {UserPrompts != "" && <div key={index} className='UserMessageDisplayed'>
                            <h2>{UserPrompts}</h2>
                          </div>}
                          <div role="status" aria-live="polite" className='AiMessageDisplayed'>
                            {props.AiResponses[0] != "" && <h2>{props.AiResponses[index] || <AiLoading/>}</h2>}
                          </div>
                        </React.Fragment>
                      ))
                      }
                    </div>
                    <div className='ChatQueryBar'>
                      <input 
                        aria-label="Ask a question about the stock"  
                        value={props.AIAssistantSearchInput} 
                        placeholder='Ask a question'
                        onChange={(e) => props.setSearchInput(e.target.value)} 
                        type="text" 
                        onKeyDown={(e) => {
                          if(e.key === "Enter"){
                            props.setSearchInput(e.currentTarget.value)
                          }
                        }}
                        />
                      <button aria-label="Submit query to AI" onClick={() => props.HandleAiResponse()}>
                        <div>
                          <div style={{width: "1.1rem", height: "0.2rem", transform: "translateY(0.45px) translateX(4px) rotate(-45deg)"}} className="ArrowOne Top"></div>
                          <div style={{width: "1.1rem", height: "0.2rem", transform: "translateY(-3px) translateX(14px) rotate(45deg)"}} className="ArrowTwo Top"></div>
                        </div>
                      </button>
                    </div>
                  </article>
        </>
    )
}