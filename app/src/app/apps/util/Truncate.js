import React, { Component, useState } from 'react'

export class Truncate extends Component {

    truncateText() {
        let textTrun = "";
        const size = this.props.size || 10
        if (( textTrun = this.props.text || "").length > size ) {
            textTrun = textTrun.substring(0,size) + "...";
        }
        return textTrun
    }

    render() {
        return (
            <div>
                { this.truncateText() }
            </div>
        );
    } 
}

export default Truncate;