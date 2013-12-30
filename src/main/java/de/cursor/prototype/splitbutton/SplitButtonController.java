/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package de.cursor.prototype.splitbutton;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.event.ActionEvent;

/**
 *
 * @author dba
 */
@ManagedBean
@ViewScoped
public class SplitButtonController {
    private boolean visible = true;
    private String output = "hello";

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }
    
    public void toggle(ActionEvent event) {
        this.visible = !this.visible;
        this.output = "toggle";
    }
    
    public void splitBtn(ActionEvent event) {
        this.output = "splitBtn";
    }
    
    public void menuBtn(ActionEvent event) {
        this.output = "menutn";
    }
    
}
