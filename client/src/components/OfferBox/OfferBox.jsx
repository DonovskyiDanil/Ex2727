import React from 'react';
import { connect } from 'react-redux';
import Rating from 'react-rating';
<<<<<<< HEAD
=======
import isEqual from 'lodash/isEqual';
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
import classNames from 'classnames';
import withRouter from '../../hocs/withRouter';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import { changeMark, clearChangeMarkError, changeShowImage } from '../../store/slices/contestByIdSlice';
import CONSTANTS from '../../constants';
import styles from './OfferBox.module.sass';

const OfferBox = (props) => {
<<<<<<< HEAD
  const { data, role, id, contestType, changeShowImage, needButtons, goToExpandedDialog, changeMark, clearError, setOfferStatus } = props;
  const { User: offerUser } = data;
  const User = offerUser || {};
  const firstName = User.firstName || '';
  const lastName = User.lastName || '';
  const displayName = User.displayName || '';
  const fullName = `${firstName} ${lastName}`.trim() || displayName || 'Creative';
  const email = User.email || 'Email unavailable';
  const avatar = User.avatar || 'anon.png';

  const findConversationInfo = () => {
    const { messagesPreview, data } = props;
    const preview = messagesPreview.find(
      (item) => item.interlocutor && item.interlocutor.id === User.id
    );
    return preview
      ? {
        id: preview.id,
        blackList: preview.blackList,
        favoriteList: preview.favoriteList,
      }
      : null;
=======
  const { data, role, id, contestType, changeShowImage, needButtons, goToExpandedDialog, changeMark, setOfferStatus } = props;
  const { User } = data;

  const findConversationInfo = () => {
    const { messagesPreview, id, data } = props;
    const participants = [id, data.User.id].sort((a, b) => a - b);
    for (let i = 0; i < messagesPreview.length; i++) {
      if (isEqual(participants, messagesPreview[i].participants)) {
        return messagesPreview[i];
      }
    }
    return null;
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  };

  return (
    <div className={styles.offerContainer}>
      {/* Галочка появляется при статусе WON (выбран создателем) */}
      {data.status === CONSTANTS.OFFER_STATUS_WON && (
        <i className={classNames('fas fa-check-circle resolve', styles.resolve)} />
      )}
      {/* Крестик появляется при статусе REJECTED */}
      {data.status === CONSTANTS.OFFER_STATUS_REJECTED && (
        <i className={classNames('fas fa-times-circle reject', styles.reject)} />
      )}
      {/* Галочка модератора появляется при статусе APPROVED */}
      {data.status === CONSTANTS.OFFER_STATUS_APPROVED && (
        <i className={classNames('fas fa-check-double', styles.moderatorApprove)} title="Approved by moderator" />
      )}
      
      <div className={styles.mainInfoContainer}>
        <div className={styles.userInfo}>
          <div className={styles.creativeInfoContainer}>
            <img 
<<<<<<< HEAD
              src={avatar === 'anon.png' ? CONSTANTS.ANONYM_IMAGE_PATH : `${CONSTANTS.publicURL}${avatar}`} 
              alt="user" 
            />
            <div className={styles.nameAndEmail}>
              <span>{fullName}</span>
              <span>{email}</span>
            </div>
          </div>
          <div
            className={styles.creativeRating}
            title={
              role === CONSTANTS.CUSTOMER && User.id !== id
                ? 'Rate this creative'
                : 'Only the contest owner can rate an offer'
            }
          >
            <span className={styles.userScoreLabel}>Creative Rating </span>
            <Rating
              initialRating={
                role === CONSTANTS.CUSTOMER
                  ? Number(data.mark) || 0
                  : 5
              }
              readonly={role !== CONSTANTS.CUSTOMER || User.id === id}
              onClick={(mark) => {
                clearError();
                return changeMark({
                  mark,
                  offerId: data.id,
                  isFirst: !data.mark,
                  creatorId: User.id,
                });
              }}
=======
              src={User.avatar === 'anon.png' ? CONSTANTS.ANONYM_IMAGE_PATH : `${CONSTANTS.publicURL}${User.avatar}`} 
              alt="user" 
            />
            <div className={styles.nameAndEmail}>
              <span>{`${User.firstName} ${User.lastName}`}</span>
              <span>{User.email}</span>
            </div>
          </div>
          <div className={styles.creativeRating}>
            <span className={styles.userScoreLabel}>Creative Rating </span>
            <Rating
              initialRating={User.rating}
              fractions={2}
              readonly
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
              fullSymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`} alt="star" />}
              placeholderSymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`} alt="star" />}
              emptySymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`} alt="star-outline" />}
            />
          </div>
        </div>

        <div className={styles.responseConainer}>
          {contestType === CONSTANTS.LOGO_CONTEST ? (
            <img 
              onClick={() => changeShowImage({ imagePath: data.fileName, isShowOnFull: true })}
              className={styles.responseLogo} 
              src={`${CONSTANTS.publicURL}${data.fileName}`} 
              alt="logo" 
            />
          ) : (
            <span className={styles.response}>{data.text}</span>
          )}
          
<<<<<<< HEAD
=======
          {User.id !== id && (
            <Rating
              fractions={2}
              onClick={(val) => changeMark({ mark: val, offerId: data.id, isFirst: !data.mark, creatorId: User.id })}
              placeholderRating={data.mark}
              fullSymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`} alt="star" />}
              placeholderSymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`} alt="star" />}
              emptySymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`} alt="star-outline" />}
            />
          )}
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
        </div>

        {role !== CONSTANTS.CREATOR && (
          <i 
            onClick={() => goToExpandedDialog({ interlocutor: User, conversationData: findConversationInfo() })} 
            className="fas fa-comments" 
          />
        )}
      </div>

      {/* Кнопки без внутреннего стейта подтверждения */}
      {needButtons(data.status) && (
        <div className={styles.btnsContainer}>
          {/* Moderator sends 'approve', Customer sends 'resolve' to mark as won */}
          {role === CONSTANTS.MODERATOR ? (
            <>
              <div onClick={() => setOfferStatus(User.id, data.id, 'approve')} className={styles.resolveBtn}>Approve</div>
              <div onClick={() => setOfferStatus(User.id, data.id, 'reject')} className={styles.rejectBtn}>Reject</div>
            </>
          ) : (
            <>
              <div onClick={() => setOfferStatus(User.id, data.id, 'resolve')} className={styles.resolveBtn}>Resolve</div>
              <div onClick={() => setOfferStatus(User.id, data.id, 'reject')} className={styles.rejectBtn}>Reject</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  id: state.userStore.data.id,
  role: state.userStore.data.role,
  messagesPreview: state.chatStore.messagesPreview
});

const mapDispatchToProps = (dispatch) => ({
  changeMark: (data) => dispatch(changeMark(data)),
  clearError: () => dispatch(clearChangeMarkError()),
  goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
  changeShowImage: (data) => dispatch(changeShowImage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OfferBox));