import React, { Component } from 'react'
import { Modal, Form, Badge } from 'react-bootstrap';
import DataObjectService from '../apps/services/DataObjectService';
import cogoToast from 'cogo-toast';

export class DataObjectList extends Component {

    constructor(props){
        super(props)
        this.state = {
          modalShow: false,
          obj: {},
          listObj: []
        }

        this.handleChange = this.handleChange.bind(this);

    }
    
    componentDidMount(){
       this.load();
    }

    async load(){
        try {
          let ret = await DataObjectService.list();
          this.setState({listObj: ret.data, obj: {}});
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not list");
        }
    }

    async delete(id){
        try {
          let ret = await DataObjectService.delete(id);
          if (ret.status === 204) {
            cogoToast.success("DataObject Deleted");
            this.load();
          } else {
            cogoToast.error("Could not exclude");
          }          
        } catch(error) {
          console.error(error)
          cogoToast.error("Could not exclude");
        }
    }

    async create() {
        try {
            let obj = this.state.obj;
            let ret = null;
            if (obj.id) {
                ret = await DataObjectService.edit(obj);
            } else {
                ret = await DataObjectService.create(obj);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.load();
                this.showModal(false)
                cogoToast.success("DataObject saved")
            }
            
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not save");
        }
    }

    async edit(id) {
        try {
            let ret = await DataObjectService.getOne(id)
            if (ret.status === 200) {
                this.setState({obj: ret.data})
                this.showModal(true)
            }            
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not edit");
        }
    }

    showModal(val) {
        if (!val){
            this.setState({obj: {}})
        }
        this.setState({modalShow: val})        
    }

    handleChange(event) {
        const obj = event.target
        switch (obj.id) {
            case 'dataObjectNameInput': {
                let doc = this.state.obj
                doc.name = obj.value
                this.setState({obj: doc})
                break;
            }
            case 'dataObjectDescriptionInput': {
                let doc = this.state.obj
                doc.description = obj.value
                doc.data = obj.value
                this.setState({obj: doc})
                break;
            }
            default:
                break;
        }
    }

    render() {
        return (
        <div className="col-lg-12 grid-margin stretch-card">             
        <div className="card">       
            <div className="card-body">
            <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title">Data Object</h4>
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
                    <th> Nome </th>
                    <th> Status </th>
                    <th> Actions </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.listObj.map( obj => (
                    <tr key={ "criteria-id-"+obj.id } >
                        <td> { obj.id } </td>
                        <td> { obj.name } </td>
                        <td>
                            <h6>
                            {obj.badges.map( badge => (
                                <>
                                {( badge == "ODD__Goal_Relevant") && <Badge pill variant="warning">Goal Relevant</Badge>}
                                {( badge == "ODD__Unavailable") && <Badge pill variant="danger">Unavailable</Badge>}
                                </>
                            ))}
                            </h6>
                        </td>
                        <td>
                        <div className="btn-group" role="group" aria-label="action-group">
                            <button type="button" className="btn btn-primary" onClick={() => this.edit(obj.id)}>
                                <i className="mdi mdi-lead-pencil"></i>
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => this.delete(obj.id)} >
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
                    { this.state.obj.id ? "(#"+this.state.obj.id+") " : "" } 
                    Data Object
                </h4>
                <div className="table-responsive">
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="dataObjectNameInput">Name</label>
                            <Form.Control type="text" id="dataObjectNameInput" placeholder="Name" value={this.state.obj.name || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="dataObjectDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="dataObjectDescriptionInput" row={4} value={this.state.obj.description || ''} onChange={this.handleChange}/>
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
                <button type="button" className="btn btn-primary" onClick={ () => this.create()}>
                    <i className="mdi mdi-content-save"></i>
                    Save
                </button>
            </Modal.Footer>
        </Modal>
        </div>
        );
    }

}

export default DataObjectList;