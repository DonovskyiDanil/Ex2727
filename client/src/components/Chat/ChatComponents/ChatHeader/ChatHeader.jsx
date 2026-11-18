import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  backToDialogList,
  changeChatFavorite,
  changeChatBlock,
} from '../../../../store/slices/chatSlice';
import styles from './ChatHeader.module.sass';
import CONSTANTS from '../../../../constants';

const ChatHeader = (props) => {
  const changeFavorite = (data, event) => {
    props.changeChatFavorite(data);
    event.stopPropagation();
  };

  const changeBlackList = (data, event) => {
    props.changeChatBlock(data);
    event.stopPropagation();
  };

<<<<<<< HEAD
  const { interlocutor, backToDialogList, chatData } = props;
  const { avatar, firstName } = interlocutor;
  const isFavorite = !!(chatData && chatData.favoriteList);
  const isBlocked = !!(chatData && chatData.blackList);
=======
  const isFavorite = (chatData, userId) => {
    const { favoriteList, participants } = chatData;
    return favoriteList[participants.indexOf(userId)];
  };

  const isBlocked = (chatData, userId) => {
    const { participants, blackList } = chatData;
    return blackList[participants.indexOf(userId)];
  };

  const { avatar, firstName } = props.interlocutor;
  const { backToDialogList, chatData, userId } = props;
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  return (
    <div className={styles.chatHeader}>
      <div
        className={styles.buttonContainer}
        onClick={() => backToDialogList()}
      >
        <img
          src={`${CONSTANTS.STATIC_IMAGES_PATH}arrow-left-thick.png`}
          alt="back"
        />
      </div>
      <div className={styles.infoContainer}>
        <div>
          <img
            src={
<<<<<<< HEAD
              !avatar || avatar === 'anon.png'
=======
              avatar === 'anon.png'
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
                ? CONSTANTS.ANONYM_IMAGE_PATH
                : `${CONSTANTS.publicURL}${avatar}`
            }
            alt="user"
          />
          <span>{firstName}</span>
        </div>
        {chatData && (
          <div>
            <i
              onClick={(event) =>
                changeFavorite(
                  {
<<<<<<< HEAD
                    interlocutorId: interlocutor.id,
                    favoriteFlag: !isFavorite,
=======
                    participants: chatData.participants,
                    favoriteFlag: !isFavorite(chatData, userId),
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
                  },
                  event
                )
              }
              className={classNames({
<<<<<<< HEAD
                'far fa-heart': !isFavorite,
                'fas fa-heart': isFavorite,
=======
                'far fa-heart': !isFavorite(chatData, userId),
                'fas fa-heart': isFavorite(chatData, userId),
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
              })}
            />
            <i
              onClick={(event) =>
                changeBlackList(
                  {
<<<<<<< HEAD
                    interlocutorId: interlocutor.id,
                    blackListFlag: !isBlocked,
=======
                    participants: chatData.participants,
                    blackListFlag: !isBlocked(chatData, userId),
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
                  },
                  event
                )
              }
              className={classNames({
<<<<<<< HEAD
                'fas fa-user-lock': !isBlocked,
                'fas fa-unlock': isBlocked,
=======
                'fas fa-user-lock': !isBlocked(chatData, userId),
                'fas fa-unlock': isBlocked(chatData, userId),
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { interlocutor, chatData } = state.chatStore;
  return { interlocutor, chatData };
};

const mapDispatchToProps = (dispatch) => ({
  backToDialogList: () => dispatch(backToDialogList()),
  changeChatFavorite: (data) => dispatch(changeChatFavorite(data)),
  changeChatBlock: (data) => dispatch(changeChatBlock(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);
