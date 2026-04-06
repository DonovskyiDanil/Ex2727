import React from 'react';
import { connect } from 'react-redux';
import Rating from 'react-rating';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import withRouter from '../../hocs/withRouter';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import { changeMark, clearChangeMarkError, changeShowImage } from '../../store/slices/contestByIdSlice';
import CONSTANTS from '../../constants';
import styles from './OfferBox.module.sass';

const OfferBox = (props) => {
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