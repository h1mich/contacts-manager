import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cookie from 'js-cookie';

class Header extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <div style={styles.logo}>Contacts Manager</div>
        {
          this.props.isAuthenticated ?
            <div className="text-hover"
                 style={ styles.logout }
                 onClick={ () => this.logout() }>
              Log out <small><i>({this.props.username})</i></small>
            </div> : null
        }
      </div>
    );
  }

  logout() {
    cookie.remove('username');
    cookie.remove('password');
    this.props.dispatch({ type: 'LOGOUT' });
    this.props.history.push('/login');
  }
}

const styles = {
  root: {
    background: 'rgb(15, 33, 76)',
    height: '40px',
    color: 'white',
    position: 'relative'
  },
  logo: {
    position: 'absolute',
    top: '50%',
    left: '10px',
    transform: 'translateY(-50%)',
    fontSize: '20px'
  },
  logout: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    fontSize: '16px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    paddingLeft: '22px',
    backgroundImage: 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAzMzAgMzMwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMzAgMzMwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij48ZyBpZD0iWE1MSURfMl8iPjxwYXRoIGlkPSJYTUxJRF80XyIgZD0iTTUxLjIxMywxODBoMTczLjc4NWM4LjI4NCwwLDE1LTYuNzE2LDE1LTE1cy02LjcxNi0xNS0xNS0xNUg1MS4yMTNsMTkuMzk0LTE5LjM5MyAgIGM1Ljg1OC01Ljg1Nyw1Ljg1OC0xNS4zNTUsMC0yMS4yMTNjLTUuODU2LTUuODU4LTE1LjM1NC01Ljg1OC0yMS4yMTMsMEw0LjM5NywxNTQuMzkxYy0wLjM0OCwwLjM0Ny0wLjY3NiwwLjcxLTAuOTg4LDEuMDkgICBjLTAuMDc2LDAuMDkzLTAuMTQxLDAuMTkzLTAuMjE1LDAuMjg4Yy0wLjIyOSwwLjI5MS0wLjQ1NCwwLjU4My0wLjY2LDAuODkxYy0wLjA2LDAuMDktMC4xMDksMC4xODUtMC4xNjgsMC4yNzYgICBjLTAuMjA2LDAuMzIyLTAuNDA4LDAuNjQ3LTAuNTksMC45ODZjLTAuMDM1LDAuMDY3LTAuMDY0LDAuMTM4LTAuMDk5LDAuMjA1Yy0wLjE4OSwwLjM2Ny0wLjM3MSwwLjczOS0wLjUzLDEuMTIzICAgYy0wLjAyLDAuMDQ3LTAuMDM0LDAuMDk3LTAuMDUzLDAuMTQ1Yy0wLjE2MywwLjQwNC0wLjMxNCwwLjgxMy0wLjQ0MiwxLjIzNGMtMC4wMTcsMC4wNTMtMC4wMjYsMC4xMDgtMC4wNDEsMC4xNjIgICBjLTAuMTIxLDAuNDEzLTAuMjMyLDAuODMtMC4zMTcsMS4yNTdjLTAuMDI1LDAuMTI3LTAuMDM2LDAuMjU4LTAuMDU5LDAuMzg2Yy0wLjA2MiwwLjM1NC0wLjEyNCwwLjcwOC0wLjE1OSwxLjA2OSAgIEMwLjAyNSwxNjMuOTk4LDAsMTY0LjQ5OCwwLDE2NXMwLjAyNSwxLjAwMiwwLjA3NiwxLjQ5OGMwLjAzNSwwLjM2NiwwLjA5OSwwLjcyMywwLjE2LDEuMDhjMC4wMjIsMC4xMjQsMC4wMzMsMC4yNTEsMC4wNTgsMC4zNzQgICBjMC4wODYsMC40MzEsMC4xOTYsMC44NTIsMC4zMTgsMS4yNjljMC4wMTUsMC4wNDksMC4wMjQsMC4xMDEsMC4wMzksMC4xNWMwLjEyOSwwLjQyMywwLjI4LDAuODM2LDAuNDQ1LDEuMjQ0ICAgYzAuMDE4LDAuMDQ0LDAuMDMxLDAuMDkxLDAuMDUsMC4xMzVjMC4xNiwwLjM4NywwLjM0MywwLjc2MSwwLjUzNCwxLjEzYzAuMDMzLDAuMDY1LDAuMDYxLDAuMTMzLDAuMDk1LDAuMTk4ICAgYzAuMTg0LDAuMzQxLDAuMzg3LDAuNjY5LDAuNTk2LDAuOTk0YzAuMDU2LDAuMDg4LDAuMTA0LDAuMTgxLDAuMTYyLDAuMjY3YzAuMjA3LDAuMzA5LDAuNDM0LDAuNjAzLDAuNjYyLDAuODk1ICAgYzAuMDczLDAuMDk0LDAuMTM4LDAuMTkzLDAuMjEzLDAuMjg1YzAuMzEzLDAuMzc5LDAuNjQxLDAuNzQzLDAuOTg4LDEuMDlsNDQuOTk3LDQ0Ljk5N0M1Mi4zMjIsMjIzLjUzNiw1Ni4xNjEsMjI1LDYwLDIyNSAgIHM3LjY3OC0xLjQ2NCwxMC42MDYtNC4zOTRjNS44NTgtNS44NTgsNS44NTgtMTUuMzU1LDAtMjEuMjEzTDUxLjIxMywxODB6IiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggaWQ9IlhNTElEXzVfIiBkPSJNMjA3LjI5OSw0Mi4yOTljLTQwLjk0NCwwLTc5LjAzOCwyMC4zMTItMTAxLjkwMyw1NC4zMzNjLTQuNjIsNi44NzUtMi43OTIsMTYuMTk1LDQuMDgzLDIwLjgxNiAgIGM2Ljg3Niw0LjYyLDE2LjE5NSwyLjc5NCwyMC44MTctNC4wODNjMTcuMjgxLTI1LjcxNSw0Ni4wNjctNDEuMDY3LDc3LjAwMy00MS4wNjdDMjU4LjQxNCw3Mi4yOTksMzAwLDExMy44ODQsMzAwLDE2NSAgIHMtNDEuNTg2LDkyLjcwMS05Mi43MDEsOTIuNzAxYy0zMC44NDUsMC01OS41ODQtMTUuMjgzLTc2Ljg3OC00MC44ODFjLTQuNjM5LTYuODY1LTEzLjk2MS04LjY2OS0yMC44MjctNC4wMzIgICBjLTYuODY0LDQuNjM4LTguNjcsMTMuOTYyLTQuMDMyLDIwLjgyNmMyMi44ODEsMzMuODY4LDYwLjkxMyw1NC4wODcsMTAxLjczNyw1NC4wODdDMjc0Ljk1NiwyODcuNzAxLDMzMCwyMzIuNjU4LDMzMCwxNjUgICBTMjc0Ljk1Niw0Mi4yOTksMjA3LjI5OSw0Mi4yOTl6IiBmaWxsPSIjRkZGRkZGIi8+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPg==)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '18px',
    backgroundPosition: 'left center'
  }
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  username: PropTypes.string
};

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.currentUser,
    username: state.currentUser ? state.credentials.username : null
  };
}

export default withRouter(connect(mapStateToProps)(Header));
