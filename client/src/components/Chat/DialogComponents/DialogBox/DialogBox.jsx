import React from 'react';
import classNames from 'classnames';
import styles from './DialogBox.module.sass';
import CONSTANTS from '../../../../constants';

const DialogBox = props => {
  const {
    chatPreview,
    userId,
    getTimeStr,
    changeFavorite,
    changeBlackList,
    catalogOperation,
    goToExpandedDialog,
    chatMode,
    interlocutor,
  } = props;
<<<<<<< HEAD
  const { favoriteList, blackList, id, text, createdAt } = chatPreview;
  const isFavorite = !!favoriteList;
  const isBlocked = !!blackList;
=======
  const {
    favoriteList,
    participants,
    blackList,
    _id,
    text,
    createAt,
  } = chatPreview;
  const isFavorite = favoriteList[participants.indexOf(userId)];
  const isBlocked = blackList[participants.indexOf(userId)];
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  return (
    <div
      className={styles.previewChatBox}
      onClick={() =>
        goToExpandedDialog({
          interlocutor,
          conversationData: {
<<<<<<< HEAD
            id,
=======
            participants,
            _id,
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
            blackList,
            favoriteList,
          },
        })
      }
    >
      <img
        src={
          interlocutor.avatar === 'anon.png'
            ? CONSTANTS.ANONYM_IMAGE_PATH
            : `${CONSTANTS.publicURL}${interlocutor.avatar}`
        }
        alt='user'
      />
      <div className={styles.infoContainer}>
        <div className={styles.interlocutorInfo}>
          <span className={styles.interlocutorName}>
            {interlocutor.firstName}
          </span>
          <span className={styles.interlocutorMessage}>{text}</span>
        </div>
        <div className={styles.buttonsContainer}>
<<<<<<< HEAD
          <span className={styles.time}>{getTimeStr(createdAt)}</span>
=======
          <span className={styles.time}>{getTimeStr(createAt)}</span>
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
          <i
            onClick={event =>
              changeFavorite(
                {
<<<<<<< HEAD
                  interlocutorId: interlocutor.id,
=======
                  participants,
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
                  favoriteFlag: !isFavorite,
                },
                event
              )
            }
            className={classNames({
              'far fa-heart': !isFavorite,
              'fas fa-heart': isFavorite,
            })}
          />
          <i
            onClick={event =>
              changeBlackList(
                {
<<<<<<< HEAD
                  interlocutorId: interlocutor.id,
=======
                  participants,
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
                  blackListFlag: !isBlocked,
                },
                event
              )
            }
            className={classNames({
              'fas fa-user-lock': !isBlocked,
              'fas fa-unlock': isBlocked,
            })}
          />
          <i
<<<<<<< HEAD
            onClick={event => catalogOperation(event, id)}
=======
            onClick={event => catalogOperation(event, _id)}
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
            className={classNames({
              'far fa-plus-square':
                chatMode !== CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
              'fas fa-minus-circle':
                chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
