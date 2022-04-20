import React, { Component } from 'react'
import { Modal, Form } from 'react-bootstrap';
import DesireService from '../apps/services/DesireService';
import { Truncate } from '../apps/util/Truncate';
import cogoToast from 'cogo-toast';

export class DesireList extends Component {

    constructor(props){
        super(props)
        this.state = {
          modalShow: false,
          desire: {},
          desires: []
        }

        this.handleChange = this.handleChange.bind(this);

    }
    
    componentDidMount(){
       this.loadDesires();
    }

    async loadDesires(){
        try {
          let ret = await DesireService.list();
          this.setState({desires: ret.data, desire: {}});
        } catch(error) {
          console.log(error)
          cogoToast.error("Cannot load the list");
        }
    }

    async deleteDesire(id){
        try {
          let ret = await DesireService.delete(id);
          if ( ret.status === 204 ) {
            cogoToast.success("Desire Deleted");
            this.loadDesires();            
          } else {
            cogoToast.error("Cannot exclude");
          }          
        } catch(error) {
          console.log(error)
          cogoToast.error("Cannot exclude");
        }
    }

    async createDesire() {
        try {
            let desire = this.state.desire;
            let ret = null;
            if (desire.id) {
                ret = await DesireService.edit(desire);
            } else {
                ret = await DesireService.create(desire);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                cogoToast.success("Desire saved")
                this.loadDesires();
                this.showModal(false)
            } else {
                cogoToast.error("Cannot save");
            }            
         } catch(error) {
            console.log(error)
            cogoToast.error("Cannot save");
        }
    }

    async editDesire(id) {
        try {
            let ret = await DesireService.getOne(id)
            if (ret.status === 200) {
                this.setState({desire: ret.data})
                this.showModal(true)
            } else {
                cogoToast.error("Cannot get data");
            }            
         } catch(error) {
            console.log(error)
            cogoToast.error("Cannot get data");
        }
    }

    showModal(val) {
        if (!val){
            this.setState({desire: {}})
        }
        this.setState({modalShow: val})        
    }

    handleChange(event) {
        const obj = event.target
        if (obj.id === 'desireNameInput') {
            let desire = this.state.desire
            desire.name = obj.value
            this.setState({desire: desire})
        }
        if (obj.id === 'desireDescriptionInput') {
            let desire = this.state.desire
            desire.description = obj.value
            this.setState({desire: desire})
        }
    }

    render() {
        return (
        <div className="col-lg-12 grid-margin stretch-card">
             
        <div className="card">
       
            <div className="card-body">
            <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title">Desire</h4>
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
                    {this.state.desires.map( desire => (
                    <tr key={ "desire-id-"+desire.id } >
                        <td> { desire.id } </td>
                        <td> { desire.name } </td>
                        <td> <Truncate text={desire.description} size={20}/> </td>
                        <td>
                        <div className="btn-group" role="group" aria-label="actions">
                            <button type="button" className="btn btn-primary" onClick={() => this.editDesire(desire.id)}>
                                <i className="mdi mdi-lead-pencil"></i>
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => this.deleteDesire(desire.id)} >
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
                    { this.state.desire.id ? "(#"+this.state.desire.id+") " : "" } 
                    Desire
                    { this.state.desire.name ? " - "+this.state.desire.name : ""} 
                </h4>
                <div className="table-responsive">
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="desireNameInput">Name</label>
                            <Form.Control type="text" id="desireNameInput" placeholder="Desire Name" value={this.state.desire.name || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="desireDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="desireDescriptionInput" row={4} value={this.state.desire.description || ''} onChange={this.handleChange}/>
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
                <button type="button" className="btn btn-primary" onClick={ () => this.createDesire()}>
                    <i className="mdi mdi-content-save"></i>
                    Save
                </button>
            </Modal.Footer>
        </Modal>
        </div>
        );
    }

}

export default DesireList;