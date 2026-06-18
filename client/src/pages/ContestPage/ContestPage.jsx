import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import LightBox from 'react-18-image-lightbox';
import withRouter from '../../hocs/withRouter';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import {
  getContestById,
  setOfferStatus,
  clearSetOfferStatusError,
  changeEditContest,
  changeContestViewMode,
  changeShowImage,
} from '../../store/slices/contestByIdSlice';
import ContestSideBar from '../../components/ContestSideBar/ContestSideBar';
import styles from './ContestPage.module.sass';
import OfferBox from '../../components/OfferBox/OfferBox';
import OfferForm from '../../components/OfferForm/OfferForm';
import CONSTANTS from '../../constants';
import Brief from '../../components/Brief/Brief';
import Spinner from '../../components/Spinner/Spinner';
import TryAgain from '../../components/TryAgain/TryAgain';
import 'react-18-image-lightbox/style.css';
import Error from '../../components/Error/Error';

class ContestPage extends React.Component {
  state = {
    isConfirmModalOpen: false,
    pendingAction: null
  };

  componentWillUnmount() {
    this.props.changeEditContest(false);
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { id } = this.props.params;
    if (id) this.props.getData({ contestId: id });
  };

  // ЦЕЙ МЕТОД ВИРІШУЄ ВІДОБРАЖЕННЯ КНОПОК
needButtons = (offerStatus) => {
  const { contestData } = this.props.contestByIdStore;
  const { data } = this.props.userStore;

  if (!contestData || !data || contestData.status !== CONSTANTS.CONTEST_STATUS_ACTIVE) return false;

  // Використовуємо == щоб не було проблем з типами ID
  const isOwner = contestData.userId == data.id || (contestData.User && contestData.User.id == data.id);

  // МОДЕРАТОР: бачить кнопки, поки оффер новий (PENDING)
  if (data.role === CONSTANTS.MODERATOR) {
    return offerStatus === CONSTANTS.OFFER_STATUS_PENDING;
  }

  // ЗАМОВНИК: бачить кнопки Resolve/Reject ТІЛЬКИ ПІСЛЯ модератора (APPROVED)
  // Саме це дозволить тобі виконати пункт 14
  if (data.role === CONSTANTS.CUSTOMER && isOwner) {
    return offerStatus === CONSTANTS.OFFER_STATUS_APPROVED;
  }

  return false;
};

  handleOfferStatusClick = (creatorId, offerId, command) => {
    const { data } = this.props.userStore;

    // Якщо замовник приймає оффер — показуємо модалку підтвердження
    if (data.role === CONSTANTS.CUSTOMER && command === CONSTANTS.OFFER_STATUS_SET_APPROVED) {
      this.setState({
        isConfirmModalOpen: true,
        pendingAction: { creatorId, offerId, command }
      });
    } else {
      this.executeStatusChange(creatorId, offerId, command);
    }
  };

  executeStatusChange = (creatorId, offerId, command) => {
    this.props.clearSetOfferStatusError();
    const { contestData } = this.props.contestByIdStore;
    
    if (contestData) {
      const { id, orderId, priority } = contestData;
      const obj = { command, offerId, creatorId, orderId, priority, contestId: id };
      this.props.setOfferStatus(obj);
    }
    
    this.setState({ isConfirmModalOpen: false, pendingAction: null });
  };

  setOffersList = () => {
    const { offers, contestData } = this.props.contestByIdStore;
    if (!offers || offers.length === 0) {
      return <div className={styles.notFound}>There is no suggestion at this moment</div>;
    }

    return offers.map((offer) => (
      <OfferBox
        data={offer}
        key={offer.id}
        needButtons={this.needButtons}
        setOfferStatus={this.handleOfferStatusClick}
        contestType={contestData.contestType}
        date={new Date()}
      />
    ));
  };

  goChat = () => {
    const { User } = this.props.contestByIdStore.contestData;
    this.props.goToExpandedDialog({
      interlocutor: User,
      conversationData: null,
    });
  };

  render() {
    const { userStore, contestByIdStore, changeShowImage, changeContestViewMode, clearSetOfferStatusError } = this.props;
    const { data: userData } = userStore;
    const { isShowOnFull, imagePath, error, isFetching, isBrief, contestData, setOfferStatusError } = contestByIdStore;
    const { isConfirmModalOpen, pendingAction } = this.state;

    if (!userData) return <Spinner />;

    return (
      <div className={styles.mainContainer}>
        {/* МОДАЛКА ПІДТВЕРДЖЕННЯ (Пункт 14) */}
        {isConfirmModalOpen && pendingAction && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', 
            justifyContent: 'center', alignItems: 'center'
          }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 10px' }}>Confirm resolve</h2>
              <p style={{ marginBottom: '20px' }}>Are you sure?</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                  onClick={() => this.executeStatusChange(pendingAction.creatorId, pendingAction.offerId, pendingAction.command)}
                  style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#8aca6b', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Yes
                </button>
                <button 
                  onClick={() => this.setState({ isConfirmModalOpen: false, pendingAction: null })}
                  style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#eb5757', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {isShowOnFull && (
          <LightBox
            mainSrc={`${CONSTANTS.publicURL}${imagePath}`}
            onCloseRequest={() => changeShowImage({ isShowOnFull: false, imagePath: null })}
          />
        )}

        {error ? (
          <div className={styles.tryContainer}><TryAgain getData={this.getData} /></div>
        ) : isFetching ? (
          <div className={styles.containerSpinner}><Spinner /></div>
        ) : (
          <div className={styles.mainInfoContainer}>
            <div className={styles.infoContainer}>
              <div className={styles.buttonsContainer}>
                <span onClick={() => changeContestViewMode(true)} className={classNames(styles.btn, { [styles.activeBtn]: isBrief })}>Brief</span>
                <span onClick={() => changeContestViewMode(false)} className={classNames(styles.btn, { [styles.activeBtn]: !isBrief })}>Offer</span>
              </div>
              {isBrief ? (
                <Brief contestData={contestData} role={userData.role} goChat={this.goChat} />
              ) : (
                <div className={styles.offersContainer}>
                  {userData.role === CONSTANTS.CREATOR && contestData?.status === CONSTANTS.CONTEST_STATUS_ACTIVE && (
                    <div className={styles.formWrapper}>
                      <OfferForm contestType={contestData.contestType} contestId={contestData.id} customerId={contestData.userId} />
                    </div>
                  )}
                  {setOfferStatusError && <Error data={setOfferStatusError.data} status={setOfferStatusError.status} clearError={clearSetOfferStatusError} />}
                  <div className={styles.offers}>{this.setOffersList()}</div>
                </div>
              )}
            </div>
            {contestData && <ContestSideBar contestData={contestData} totalEntries={contestByIdStore.offers.length} />}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ 
  contestByIdStore: state.contestByIdStore,
  userStore: state.userStore,
  chatStore: state.chatStore
});

const mapDispatchToProps = (dispatch) => ({
  getData: (data) => dispatch(getContestById(data)),
  setOfferStatus: (data) => dispatch(setOfferStatus(data)),
  clearSetOfferStatusError: () => dispatch(clearSetOfferStatusError()),
  goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
  changeEditContest: (data) => dispatch(changeEditContest(data)),
  changeContestViewMode: (data) => dispatch(changeContestViewMode(data)),
  changeShowImage: (data) => dispatch(changeShowImage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContestPage));