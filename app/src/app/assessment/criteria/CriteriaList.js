import React, { Component } from 'react'
import { Modal, Form } from 'react-bootstrap';
import CriteriaService from '../../apps/services/CriteriaService';
import cogoToast from 'cogo-toast';

export class CriteriaList extends Component {

    constructor(props){
        super(props)
        this.state = {
          modalShow: false,
          criteria: {},
          listCriteria: []
        }

        this.handleChange = this.handleChange.bind(this);

    }
    
    componentDidMount(){
       this.load();
    }

    async load(){
        try {
          let ret = await CriteriaService.list();
          this.setState({listCriteria: ret.data, criteria: {}});
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not list");
        }
    }

    async delete(id){
        try {
          let ret = await CriteriaService.delete(id);
          if (ret.status === 204) {
            cogoToast.success("Criteria Deleted");
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
            let criteria = this.state.criteria;
            let ret = null;
            if (criteria.id) {
                ret = await CriteriaService.edit(criteria);
            } else {
                ret = await CriteriaService.create(criteria);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.load();
                this.showModal(false)
                cogoToast.success("Criteria saved")
            }
            
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not save");
        }
    }

    async edit(id) {
        try {
            let ret = await CriteriaService.getOne(id)
            if (ret.status === 200) {
                this.setState({criteria: ret.data})
                this.showModal(true)
            }            
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not edit");
        }
    }

    showModal(val) {
        if (!val){
            this.setState({criteria: {}})
        }
        this.setState({modalShow: val})        
    }

    handleChange(event) {
        const obj = event.target
        switch (obj.id) {
            case 'criteriaLevelInput': {
                let criteria = this.state.criteria
                criteria.level = obj.value
                this.setState({criteria: criteria})
                break;
            }
            case 'criteriaSiglaInput': {
                let criteria = this.state.criteria
                criteria.sigla = obj.value
                this.setState({criteria: criteria})
                break;
            }
            case 'criteriaCriteriaInput': {
                let criteria = this.state.criteria
                criteria.criteria = obj.value
                this.setState({criteria: criteria})
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
                <h4 className="card-title">Criteria</h4>
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
                    <th> Level </th>
                    <th> Sigla </th>
                    <th> Criteria </th>
                    <th> Actions </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.listCriteria.map( criteria => (
                    <tr key={ "criteria-id-"+criteria.id } >
                        <td> { criteria.id } </td>
                        <td> { criteria.level } </td>
                        <td> { criteria.sigla } </td>
                        <td> { criteria.criteria } </td>
                        <td>
                        <div className="btn-group" role="group" aria-label="action-group">
                            <button type="button" className="btn btn-primary" onClick={() => this.edit(criteria.id)}>
                                <i className="mdi mdi-lead-pencil"></i>
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => this.delete(criteria.id)} >
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
                    { this.state.criteria.id ? "(#"+this.state.criteria.id+") " : "" } 
                    Criteria 
                    { this.state.criteria.sigla ? " - "+this.state.criteria.sigla : ""} 
                </h4>
                <div className="table-responsive">
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="criteriaLevelInput">Level</label>
                            <Form.Control type="text" id="criteriaLevelInput" placeholder="Level" value={this.state.criteria.level || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="criteriaSiglaInput">Sigla</label>
                            <Form.Control type="text" id="criteriaSiglaInput" placeholder="Sigla" value={this.state.criteria.sigla || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="criteriaCriteriaInput">Criteria</label>
                            <Form.Control type="text" id="criteriaCriteriaInput" placeholder="Criteria" value={this.state.criteria.criteria || ''} onChange={this.handleChange} required />
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

export default CriteriaList;