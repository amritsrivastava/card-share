import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as _ from 'lodash';
import { Redirect } from 'react-router-dom';
import { URL } from '../../../config';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import MuiDialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';

// File Imports
import {
  SecondaryTextField as InputField,
  TertiaryTextField
} from '../../../components/widgets/InputField';
import {
  PrimaryButton,
  SecondaryButton
} from '../../../components/widgets/Button';
import SingUpImg from '../../../assets/img/backgrounds/signup.png';
import GoogleIcon from '../../../assets/img/icons/google.png';
import FacebookIcon from '../../../assets/img/icons/fb.png';

const Dialog = withStyles({
  root: {
    '& .MuiDialog-paper': {
      width: '500px',
      padding: '10px'
    }
  }
})(MuiDialog);

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      redirect: false,
      hasError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleGoogleSignup = this.handleGoogleSignup.bind(this);
    this.handleFacebookSignup = this.handleFacebookSignup.bind(this);
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log("Has error called")
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ [event.currentTarget.name]: event.currentTarget.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios({
      method: 'post',
      url: `${URL}/auth/register`,
      data: _.pick(this.state, 'name', 'email', 'username', 'password'),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        return res.data.data;
      })
      .then(val => {
        localStorage.setItem('token', val.token.accessToken);
        localStorage.setItem('userId', val.user.id);
        this.setState({
          redirect: true,
          redirectPath: `/select-card/${val.user.id}`
        });
      })
      .catch(err => {
        console.log(err.response)
        if(err.response.status === 409) {
          window.alert('Email and username already exists !!')  
        } if(err.response.status === 500) {
          window.alert('Server Not Responding !!')
        } else {
          window.alert('Connection error!!')
        }
      });
  }

  // Dialog Box Handler Functions
  handleClickOpen() {
    this.state.open
      ? this.setState({ open: false })
      : this.setState({ open: true });
  }
  handleClose() {
    this.setState({ open: false });
  }

  handleGoogleSignup(res) {
    axios({
      method: 'post',
      url: `${URL}/auth/google`,
      data: { access_token: res.accessToken },
      config: { headers: { 'Content-Type': 'application/json' } }
    })
      .then(res => res.data)
      .then(val => {
        localStorage.setItem('token', val.token.accessToken);
        localStorage.setItem('userId', val.user.id);
        this.setState({
          redirect: true,
          redirectPath: `/select-card/${val.user.id}`
        });
      })
      .catch(err => console.log(err));
  }

  handleFacebookSignup(res) {
    axios({
      method: 'post',
      url: `${URL}/auth/facebook`,
      data: { access_token: res.accessToken },
      config: { headers: { 'Content-Type': 'application/json' } }
    })
      .then(res => res.data)
      .then(val => {
        localStorage.setItem('token', val.token.accessToken);
        localStorage.setItem('userId', val.user.id);
        this.setState({
          redirect: true,
          redirectPath: `/select-card/${val.user.id}`
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const ForgotPasswordDialog = (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
        <DialogContent>
          <TertiaryTextField
            autoFocus
            margin="dense"
            name="email-username"
            label="Email/Username"
            type="text"
            fullWidth
            tertiary
          />
        </DialogContent>
        <DialogActions>
          <PrimaryButton onClick={this.handleClose}>Submit</PrimaryButton>
          <PrimaryButton onClick={this.handleClose}>Close</PrimaryButton>
        </DialogActions>
      </Dialog>
    );
    if(this.state.hasError) {
      return <h1>Error occurred</h1>
    }
    if (!this.state.redirect) {
      return (
        <div className="container-fluid text-center h-100" id="signup">
          <div className="row">
            <div className="col-lg-7 col-md-0  w-100 signup-img-cont">
              <img
                src={SingUpImg}
                className="img-fluid sign-up-img h-100"
                alt="sign up creative"
              />
            </div>
            <div className="col-lg-5 col-md-12 form w-100 text-center">
              <Typography
                variant="h4"
                fontFamily="Roboto"
                className="text-light my-3"
              >
                Sign Up
              </Typography>
              <form
                className="w-75 justify-content-center mx-auto"
                onSubmit={this.handleSubmit}
              >
                <InputField
                  name="name"
                  label="Name"
                  placeholder="Name"
                  className="w-100 my-3"
                  margin="normal"
                  type="text"
                  onChange={this.handleChange}
                  autoComplete="on"
                  autoFocus={true}
                  required={true}
                />
                <InputField
                  name="email"
                  label="Email"
                  placeholder="Email"
                  className="w-100 my-3"
                  margin="normal"
                  type="email"
                  onChange={this.handleChange}
                  autoComplete="on"
                  required={true}
                />
                <InputField
                  name="username"
                  label="Username"
                  placeholder="Username"
                  className="w-100 my-3"
                  margin="normal"
                  type="text"
                  onChange={this.handleChange}
                  autoComplete="on"
                  required={true}
                />
                <InputField
                  name="password"
                  label="Password"
                  placeholder="Password"
                  className="w-100 my-3"
                  margin="normal"
                  type="password"
                  onChange={this.handleChange}
                  autoComplete="on"
                  required={true}
                />
                <div className="w-100 btn-cont my-3">
                  <SecondaryButton className="float-left p-2" type="submit">
                    Sign Up
                  </SecondaryButton>
                  <Link to="/login">
                    <SecondaryButton className="float-right p-2">
                      Login
                    </SecondaryButton>
                  </Link>
                </div>
                <div className="row justify-content-center my-4">
                  <GoogleLogin
                    clientId="447127459950-t6p0gajeepoqdg88l20nqpbmalpnkca8.apps.googleusercontent.com"
                    onSuccess={this.handleGoogleSignup}
                    render={renderProps => (
                      <SecondaryButton
                        className="float-left p-2 social-btn"
                        onClick={renderProps.onClick}
                      >
                        <img
                          src={GoogleIcon}
                          alt="google icon"
                          className="mr-2"
                        />
                        Sign Up with Google
                      </SecondaryButton>
                    )}
                  />
                </div>
                <div className="row justify-content-center my-4">
                  <FacebookLogin
                    appId="906865123023704"
                    textButton={
                      <SecondaryButton className="float-left p-2 social-btn">
                        <img
                          src={FacebookIcon}
                          alt="facebook icon"
                          className="mr-2"
                        />
                        Sign Up with Facebook
                      </SecondaryButton>
                    }
                    cssClass="m-0 p-0"
                    callback={this.handleFacebookSignup}
                  />
                </div>
              </form>
            </div>
          </div>
          {ForgotPasswordDialog}
        </div>
      );
    } else {
      return <Redirect push to={this.state.redirectPath} />;
    }
  }
}

export default SignUpPage;
