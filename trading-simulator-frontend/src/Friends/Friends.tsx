import { useEffect, useRef, useState } from 'react'
import './Friends.css'
import { FocusTrap } from 'focus-trap-react';
import Error from '../Error/Error';
import getAllUsers from '../Functions/getAllUsers';
import '../Interfaces/interfaces'
import { UserObj } from '../Interfaces/interfaces';

export default function Friends(){
    const [displayError, setDisplayError] = useState<{display: boolean, warning: boolean, title: string, bodyText: string, buttonText: string}>({display: false, title: "", bodyText: "", warning: false, buttonText: ""});
    const [userList, setUserList] = useState<UserObj[]>([])
    const [searchList, setSearchList] = useState<UserObj[]>([])
    const [displaySuggestions, setDisplaySuggestions] = useState<boolean>(false)
    const [input, setInput] = useState<string>("")
    const wrapperRef = useRef<HTMLDivElement>(null);
    

    useEffect(() => {
        async function getUsers(){
            const users = await getAllUsers({setDisplayError: setDisplayError})
            console.log(users)
            setUserList(users)
        }
        getUsers()
    }, [])

    function setRecommendations(input: string){
        let filter = userList.filter(user => user.username.toLowerCase().startsWith(input))
        console.log(input, " ", filter)
        setDisplaySuggestions(true)
        setSearchList(filter)
    }

      useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setDisplaySuggestions(false);
          }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    return(
        <>
            <section ref={wrapperRef} className="UserFriendSearch">
                <article className='InputSection'>
                    <input placeholder='Search a name... (e.g. AashiqD)' type="text" onClick={() => setDisplaySuggestions(true)} onChange={(e) => {setInput(e.target.value); setRecommendations(e.target.value.toLowerCase())}}/>
                    <button>Search</button>
                </article>
                {(displaySuggestions) && (searchList.length > 0) && (input.length > 0) && <article className='UserFriendSuggestions'>
                    {searchList.map((user) => (
                        <div key={user.id}>
                            <h3>{user.username}</h3>
                            <button onClick={() => {console.log("Add Friend")}}>Add Friend</button>
                        </div>))}
                </article>}
            </section>
            <section className='FriendsTitle'>
                <div></div>
                <h2>Friends</h2>
                <div></div>
            </section>
            <section className='FriendsTitle'>
                <div></div>
                <h2>Requests</h2>
                <div></div>
            </section>
            {displayError.display && 
                <FocusTrap>
                  <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
                    <Error setDisplayError={setDisplayError} warning={displayError.warning} title={displayError.title} bodyText={displayError.bodyText} buttonText={displayError.buttonText}/>
                  </div>
                </FocusTrap>}
        </>
    )
}