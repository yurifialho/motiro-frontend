import React, { Component } from 'react'
import { Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SocializationService from '../apps/services/SocializationService';
import { Truncate } from '../apps/util/Truncate';
import cogoToast from 'cogo-toast';
import SocializatonService from '../apps/services/SocializationService';

export class SocilizationList extends Component {
    
    constructor(props){
        super(props)
        this.state = {
          modalShow: false,
          socialization: {},
          listSocialization: []
        }

        this.handleChange = this.handleChange.bind(this);

    }
    
    componentDidMount(){
       this.load();
    }

    async load(){
        try {
          let ret = await SocializationService.list();
          this.setState({listSocialization: ret.data, socialization: {}});
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not to get data list.");
        }
    }

    async delete(id){
        try {
          let ret = await SocializationService.delete(id);
          if (ret.status === 204) {
            cogoToast.success("Socialization was deleted");
            this.load();
          } else {
            cogoToast.error("Could not delete");
          }          
        } catch(error) {
          console.error(error)
          cogoToast.error("Could not delete");
        }
    }

    async save() {
        try {
            let socialization = this.state.socialization;
            let ret = null;
            if (socialization.id) {
                ret = await SocializationService.edit(socialization);
            } else {
                ret = await SocializationService.create(socialization);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.load();
                this.showModal(false)
                cogoToast.success("Socialization saved")
            }
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    async edit(id) {
        try {
            let ret = await SocializationService.getOne(id)
            if (ret.status === 200) {
                this.setState({socialization: ret.data})
                this.showModal(true)
            }            
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not to get data");
        }
    }

    showModal(val) {
        if (!val){
            this.setState({socialization: {}})
        }
        this.setState({modalShow: val})        
    }

    handleChange(event) {
        const obj = event.target
        if (obj.id === 'socializationNameInput') {
            let socialization = this.state.socialization
            socialization.name = obj.value
            this.setState({socialization: socialization})
        }
        if (obj.id === 'socializationDescriptionInput') {
            let socialization = this.state.socialization
            socialization.description = obj.value
            this.setState({socialization: socialization})
        }
    }

    render() {
        return (
        <div>
        <div className="page-header">
            <h3 className="page-title">Socialization</h3>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active" aria-current="page">Socialization</li>
                </ol>
            </nav>
        </div>
        <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">             
        <div className="card">       
            <div className="card-body">
            <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title">Socialization</h4>
                <button type="button" className="btn btn-success" onClick={ () => this.showModal(true) }>
                    <i className="mdi mdi-plus-circle-outline"></i>
                    Add
                </button>
            </div>
            <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                    <tr>
                    <th> # </th>
                    <th> Name </th>
                    <th> Description </th>
                    <th> Actions </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.listSocialization.map( social => (
                    <tr key={ "socialization-id-"+social.id } >
                        <td> { social.id } </td>
                        <td> { social.name } </td>
                        <td> <Truncate text={social.description} size={20}/> </td>
                        <td>
                        <div className="btn-group" role="group" aria-label="group">
                            <Link to={"/socialization/"+social.id}>
                                <button type="button" className="btn btn-warning">
                                    <i className="mdi mdi-eye"></i>
                                </button>
                            </Link>
                            <button type="button" className="btn btn-primary" onClick={() => this.edit(social.id)}>
                                <i className="mdi mdi-lead-pencil"></i>
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => this.delete(social.id)} >
                                <i className="mdi mdi-delete-forever"></i>
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}                      
                </tbody>
                </table>
            </div>
            </div>
        </div>
        <Modal show={ this.state.modalShow } aria-labelledby="contained-modal-title-vcenter" centered >
            <div className="card">
                <div className="card-body">
                <h4 className="card-title">
                    { this.state.socialization.id ? "(#"+this.state.socialization.id+") " : "" } 
                    Socialization
                    { this.state.socialization.name ? " - "+this.state.socialization.name : ""} 
                </h4>
                <div className="table-responsive">
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="socializationNameInput">Name</label>
                            <Form.Control type="text" id="socializationNameInput" placeholder="Socialization Name" value={this.state.socialization.name || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="socializationDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="socializationDescriptionInput" row={4} value={this.state.socialization.description || ''} onChange={this.handleChange}/>
                        </Form.Group>
                    </Form>
                </div>
                </div>
            </div>
            <Modal.Footer>
                <button type="button" className="btn btn-danger" onClick={ () => this.showModal(false) }>
                    <i className="mdi mdi-window-close"></i>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={ () => this.save()}>
                    <i className="mdi mdi-content-save"></i>
                    Save
                </button>
            </Modal.Footer>
        </Modal>
        </div>
        </div>
        </div>
        );
    }

}

export default SocilizationList;