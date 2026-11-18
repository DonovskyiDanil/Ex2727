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

  const { interlocutor, backToDialogList, chatData } = props;
  const { avatar, firstName } = interlocutor;
  const isFavorite = !!(chatData && chatData.favoriteList);
  const isBlocked = !!(chatData && chatData.blackList);
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
              !avatar || avatar === 'anon.png'
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
                    interlocutorId: interlocutor.id,
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
              onClick={(event) =>
                changeBlackList(
                  {
                    interlocutorId: interlocutor.id,
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
