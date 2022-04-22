import React, { Component } from 'react'
import { Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProcessService from '../apps/services/ProcessService';
import { Truncate } from '../apps/util/Truncate';
import cogoToast from 'cogo-toast';

export class ProcessList extends Component {
    
    constructor(props){
        super(props)
        this.state = {
          modalShow: false,
          process: {},
          listProcess: []
        }

        this.handleChange = this.handleChange.bind(this);

    }
    
    componentDidMount(){
       this.loadProcess();
    }

    async loadProcess(){
        try {
          let ret = await ProcessService.list();
          this.setState({listProcess: ret.data, process: {}});
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not to get data list.");
        }
    }

    async delete(id){
        try {
          let ret = await ProcessService.delete(id);
          if (ret.status === 204) {
            cogoToast.success("Process was deleted");
            this.loadProcess();
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
            let process = this.state.process;
            let ret = null;
            if (process.id) {
                ret = await ProcessService.edit(process);
            } else {
                ret = await ProcessService.create(process);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.loadProcess();
                this.showModal(false)
                cogoToast.success("Process saved")
            }
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    async edit(id) {
        try {
            let ret = await ProcessService.getOne(id)
            if (ret.status === 200) {
                this.setState({process: ret.data})
                this.showModal(true)
            }            
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not to get data");
        }
    }

    showModal(val) {
        if (!val){
            this.setState({process: {}})
        }
        this.setState({modalShow: val})        
    }

    handleChange(event) {
        const obj = event.target
        if (obj.id === 'processNameInput') {
            let process = this.state.process
            process.name = obj.value
            this.setState({process: process})
        }
        if (obj.id === 'processDescriptionInput') {
            let process = this.state.process
            process.description = obj.value
            this.setState({process: process})
        }
    }

    render() {
        return (
        <div>
        <div className="page-header">
            <h3 className="page-title">Process</h3>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active" aria-current="page">Process</li>
                </ol>
            </nav>
        </div>
        <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">             
        <div className="card">       
            <div className="card-body">
            <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title">Process</h4>
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
                    {this.state.listProcess.map( process => (
                    <tr key={ "process-id-"+process.id } >
                        <td> { process.id } </td>
                        <td> { process.name } </td>
                        <td> <Truncate text={process.description} size={20}/> </td>
                        <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <Link to={"/process/"+process.id}>
                                <button type="button" className="btn btn-warning">
                                    <i className="mdi mdi-eye"></i>
                                </button>
                            </Link>
                            <button type="button" className="btn btn-primary" onClick={() => this.edit(process.id)}>
                                <i className="mdi mdi-lead-pencil"></i>
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => this.delete(process.id)} >
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
                    { this.state.process.id ? "(#"+this.state.process.id+") " : "" } 
                    Process
                    { this.state.process.name ? " - "+this.state.process.name : ""} 
                </h4>
                <div className="table-responsive">
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="processNameInput">Name</label>
                            <Form.Control type="text" id="processNameInput" placeholder="Process Name" value={this.state.process.name || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="processDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="processDescriptionInput" row={4} value={this.state.process.description || ''} onChange={this.handleChange}/>
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

export default ProcessList;