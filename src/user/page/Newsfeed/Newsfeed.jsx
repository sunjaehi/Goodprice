import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';

const LoaderWrap = styled.div`
  width:100%;
  height:80%;
  display:flex;
  justify-content:center;
  text-align:center;
  align-items:center;
`;

const ItemWrap = styled.div`
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  text-align:center;
  align-items:center;

  .Item {
    width:350px;
    height:300px;
    display:flex;
    flex-direction:column;
    background-color:#fff;
    margin:1rem;
    box-shadow:rgba(100,100,111,0.2) 0px 7px 29px 0px;
    border-radius:6px;
  }
`;

function Newsfeed() {
  const [itemList, setItemList] = useState([1,2,3,4,5,6,7,8,9,10]);
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onIntersect = async ([entry], observer) => {
    if (entry.isIntersecting && !isLoading) {
        observer.unobserve(entry.target);
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        let Items = [1,2,3,4,5,6,7,8,9,10];
        setItemList((itemLists) => itemLists.concat(Items));
        setIsLoading(false);
        observer.observe(entry.target);
      }
    };
    useEffect(()=>{
      let observer;
      if (target) {
        observer = new IntersectionObserver(onIntersect, {
          threshold: 0.5,
        });
        observer.observe(target);
      }
      return () => observer && observer.disconnect();
    },[target]);
  
  return (
    <div className='App'>
      <ItemWrap>
        {itemList.map((item,index)=> (
          <div className='Item' key={index}>{index+1}</div>
        ))}
      </ItemWrap>
      {isLoading ? (
        <LoaderWrap>
          <ReactLoading type="spin" color="#00008b" />
        </LoaderWrap>
      ) : (
        ""
      )}
      <div ref={setTarget}></div>
    </div>
  );
}
export default Newsfeed;