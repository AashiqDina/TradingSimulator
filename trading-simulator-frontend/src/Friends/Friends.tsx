import { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import './Friends.css'
import { FocusTrap } from 'focus-trap-react';
import Error from '../Error/Error';
import getAllUsers from '../Functions/getAllUsers';
import '../Interfaces/interfaces'
import { UserObj } from '../Interfaces/interfaces';
import { useAuth } from '../Functions/AuthContext';
import getFriends from '../Functions/getFriends';
import AddFriend from '../Functions/AddFriend';
import getSentRequests from '../Functions/getSentRequests';
import getReceivedRequests from '../Functions/getReceivedRequests';
import AcceptFriendRequest from '../Functions/AcceptFriendRequest';
import DeclineFriendRequest from '../Functions/DeclineFriendRequest';
import DeleteFriend from '../Functions/DeleteFriend';
import React from 'react';
import Loading from '../Loading/Loading';

export default function Friends(){
    const { user } = useAuth();
    const navigate = useNavigate();
    const [displayError, setDisplayError] = useState<{display: boolean, warning: boolean, title: string, bodyText: string, buttonText: string}>({display: false, title: "", bodyText: "", warning: false, buttonText: ""});
    const [userList, setUserList] = useState<UserObj[]>([])
    const [searchList, setSearchList] = useState<UserObj[]>([])
    const [displaySuggestions, setDisplaySuggestions] = useState<boolean>(false)
    const [input, setInput] = useState<string>("")
    const [friendsList, setFriendsList] = useState<any[] | null>(null)
    const [receivedRequestList, setReceivedRequestList] = useState<any | null>(null)
    const [sentRequestsList, setSentRequestsList] = useState<any | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [DeleteFriendModal, setDeleteFriendModal] = useState<{id: number; username: string; profitLoss: number} | null>(null)
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

    useEffect(() => {
      async function getData(){
        console.log(user?.id)
        if(user){
          const theFriendList = await getFriends({userId: user?.id, setDisplayError: setDisplayError})
          console.log(theFriendList)
          setFriendsList(theFriendList)
          const sentList = await getSentRequests({userId: user?.id, setDisplayError: setDisplayError})
          setSentRequestsList(sentList)
          const receivedList = await getReceivedRequests({userId: user?.id, setDisplayError: setDisplayError})
          console.log(receivedList)
          setReceivedRequestList(receivedList)
          setLoading(false)
        }
      }
      getData()
    }, [user])

    async function sendFriendRequest(friendId: number){
      if(user?.id && friendId){
        console.log("Sending Request")
        const result = await AddFriend({userId: user?.id, friendId: friendId, setDisplayError: setDisplayError})
        await refreshAll()
        console.log(result)
      }
    }

    async function refreshAll() {
      const theFriendList = await getFriends({ userId: user?.id, setDisplayError });
      setFriendsList(theFriendList);

      const sentList = await getSentRequests({ userId: user?.id, setDisplayError });
      setSentRequestsList(sentList);

      const receivedList = await getReceivedRequests({ userId: user?.id, setDisplayError });
      setReceivedRequestList(receivedList);
    }

    async function HandleAcceptFriendRequest(friendId: number){
      await AcceptFriendRequest({userId: user?.id, friendId: friendId, setDisplayError: setDisplayError});
      await refreshAll();
    }

    async function HandleDeclineFriendRequest(friendId: number){
      await DeclineFriendRequest({userId: user?.id, friendId: friendId, setDisplayError: setDisplayError});
      await refreshAll();
    }

    async function HandleDeleteFriend(friendId: number){
      await DeleteFriend({userId: user?.id, friendId: friendId})
      await refreshAll();
    }

    return(
        <>
            {!loading && <section ref={wrapperRef} className="UserFriendSearch">
                <article className='InputSection'>
                    <input aria-label='Search for a friend' placeholder='Search a name... (e.g. AashiqD)' type="text" onClick={() => setDisplaySuggestions(true)} onChange={(e) => {setInput(e.target.value); setRecommendations(e.target.value.toLowerCase())}}/>
                    <button aria-label='Search'>Search</button>
                </article>
                {(displaySuggestions) && (searchList.length > 0) && (input.length > 0) && <article className='UserFriendSuggestions'>
                    {searchList.map((OtherUser) => {
                      if(OtherUser.id == user?.id){
                        return (
                        <React.Fragment key={OtherUser.id}>
                        </React.Fragment>
                        )
                      }
                      else{
                        if(sentRequestsList.some((user: { id: number; username: string; profitLoss: number;}) => user.id === OtherUser.id)){
                          return (
                            <div key={OtherUser.id}>
                              <h3>{OtherUser.username}</h3>
                              <div>
                                <h4>Pending</h4>
                              </div>
                            </div>)
                        }
                        else if(receivedRequestList.some((user: { id: number; username: string; profitLoss: number;}) => user.id === OtherUser.id)){
                          return (
                            <div key={OtherUser.id}>
                              <h3>{OtherUser.username}</h3>
                              <div>
                                <button aria-label={`Accept ${OtherUser.username}'s Friend Request`} onClick={() => {HandleAcceptFriendRequest(OtherUser.id)}}>Accept</button>
                                <button aria-label={`Decline ${OtherUser.username}'s Friend Request`} onClick={() => {HandleDeclineFriendRequest(OtherUser.id)}}>Decline</button>
                              </div>
                            </div>)
                        }
                        else if(friendsList?.some((user: { id: number; username: string; profitLoss: number;}) => user.id === OtherUser.id)){
                          return (
                            <div key={OtherUser.id} onClick={() => navigate(`/user/${OtherUser.id}/${OtherUser.username}`)} style={{cursor: "pointer"}}>
                                <h3>{OtherUser.username}</h3>
                                <div>
                                  <h4>Friend</h4>
                                </div>
                              </div>)
                        }
                        else{
                          return (
                          <div key={OtherUser.id}>
                              <h3>{OtherUser.username}</h3>
                              <button aria-label={`Send ${OtherUser.username} a Friend Request`} onClick={() => {sendFriendRequest(OtherUser.id)}}>Add Friend</button>
                          </div>)
                        }
                      }})}
                </article>}
            </section>}
            {!loading && <section className='FriendsTitle'>
                <div></div>
                <h2>Friends</h2>
                <div></div>
            </section>}
            {!loading && <section className='FriendsList'>
              {friendsList?.map((friend: any, index: number) => (
                <article key={friend.id} onClick={() => navigate(`/user/${friend.id}/${friend.username}`)}>
                  <div className='FriendNameAndProfit'>
                    <h3>{friend.username}</h3>
                  </div>
                  <div className='plAndDeleteContainer'>
                    <p style={friend.profitLoss < 0 ? {color: "rgba(200, 25, 25, 1)"} : {color: "rgb(69, 160, 73)"}}>{friend.profitLoss < 0 ? "-" : "+"}£{(Math.abs(friend.profitLoss)).toFixed(2)}</p>
                    <div className='DeleteButtonContainer'>
                      <button aria-label={`Remove ${friend.username} as a friend`} className='DeleteButton' onClick={(e) => {e.stopPropagation(); setDeleteFriendModal({id: friend.id, username: friend.username, profitLoss: friend.profitLoss})}}>
                        <div className="CrossContainer">
                          <div className="Cross1"></div>
                          <div className="Cross2"></div>
                        </div>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {(friendsList == null || friendsList.length == 0) && 
                <h3>No Friends</h3>}
            </section>}
            {(receivedRequestList?.length > 0 || sentRequestsList?.length > 0) && !loading && <><section className='FriendsTitle'>
                <div></div>
                <h2>Requests</h2>
                <div></div>
            </section>
            <section className='FriendRequestsList'>
              {receivedRequestList?.map((FriendRequest: any, index: number) => (
                <article key={index}>
                  <h3>{FriendRequest.username}</h3>
                  <div>
                    <button aria-label={`Accept ${FriendRequest.username}'s Friend Request`} onClick={() => {HandleAcceptFriendRequest(FriendRequest.id)}}>Accept</button>
                    <button aria-label={`Decline ${FriendRequest.username}'s Friend Request`} onClick={() => {HandleDeclineFriendRequest(FriendRequest.id)}}>Decline</button>
                  </div>
                </article>
              ))}
              {sentRequestsList?.map((FriendRequest: any, index: number) => (
                <article key={index}>
                  <h3>{FriendRequest.username}</h3>
                    <h4>Pending</h4>
                </article>
              ))}
            </section></>}
            {DeleteFriendModal && (
            <FocusTrap>
            <div className="Modal">
              <div className="ModalContent">
                <h2>Are you sure you want to remove {DeleteFriendModal.username}?</h2>
                <div>
              </div>
                <div className="ModalFooter">
                  <button aria-label="Cancel" className="" onClick={() => {setDeleteFriendModal(null)}}>Cancel</button>
                  <button aria-label={`Remove ${DeleteFriendModal.username}`} className="" onClick={() => {HandleDeleteFriend(DeleteFriendModal.id); setDeleteFriendModal(null)}}>Remove</button>
                </div>
              </div>
            </div>
            </FocusTrap>
          )}
            {loading && <Loading/>}
            {displayError.display && 
                <FocusTrap>
                  <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
                    <Error setDisplayError={setDisplayError} warning={displayError.warning} title={displayError.title} bodyText={displayError.bodyText} buttonText={displayError.buttonText}/>
                  </div>
                </FocusTrap>}
        </>
    )
}