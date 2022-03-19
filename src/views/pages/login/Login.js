import React, { lazy, Component } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormFeedback,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { withRouter, Redirect } from 'react-router-dom'
import { verify, login, Methods, post } from '../../../api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from "prop-types";

export class Login extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      error: "",
      username: "",
      password: "",
      validated: false
    }
  }

  handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.log_in();
    e.preventDefault();
  }
  async componentDidMount() {
    var redirect = false
    var res = await verify()
    if (res) {
      this.setState({ redirect: true })
      redirect = true
    } else {
      localStorage.setItem('token', "")
    }
    const t = `${localStorage.getItem('token')}`
    if (t != 'null' && t != "") {
      redirect = true
      this.setState({ redirect: true })
    }
  }
  loginOnClickHandler(e) {
    const form = document.getElementById("ff")
    if (form.checkValidity() === false) {
      toast.error("Please fill all fields", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      this.log_in();
      e.preventDefault();
    }
  }
  async log_in() {
    const loginModel = {
      "user_username": this.state.username,
      "user_password": this.state.password,
      "remove_fields": [
        "user_password"
      ],
      "type": "login"
    }
    await login(loginModel, 0).then(function (result) {
      console.log(result)
    }, err => {
      console.log("Hatta")
    });
    this.getCollection(loginModel)
  }
  async getCollection(loginModel) {
    var onay = false
    var hata = ""

    await post(loginModel, Methods.GetCollection).then(function (result) {
      onay = true
    }, err => {
      onay = false
      try {
        hata = err.response.data
      } catch {
        hata = err.message
      }
    });
    if (!onay) {
      localStorage.removeItem('token');
      toast.error(hata, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    this.setState({ redirect: onay })
    
  }
  changeStateFormData(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render() {
    const { redirect, error } = this.state;

    if (redirect) {
      return <Redirect to='/upload' />;
    }
    return (

      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <ToastContainer />
            <CCol md={6}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm id="ff" className="needs-validation" target="./upload">
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput required placeholder="Username" onChange={this.changeStateFormData.bind(this)} name="username" autoComplete="username" />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          defaultValue=""
                          required
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password" onChange={this.changeStateFormData.bind(this)} name="password"
                        />
                        <CFormFeedback invalid>Please enter your password</CFormFeedback>
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton color="primary" className="px-4" onClick={this.loginOnClickHandler.bind(this)}>
                            Login
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>

              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}

export default Login
