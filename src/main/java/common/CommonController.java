/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package common;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.event.ActionEvent;

/**
 *
 * @author dba
 */
@ManagedBean
@ViewScoped
public class CommonController {
    private boolean visible = true;
    private boolean bool = false;
    private String output = "hello";

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public boolean isBool() {
        return bool;
    }

    public void setBool(boolean bool) {
        this.bool = bool;
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
    
    public void actionListener(ActionEvent event) {
        this.output = "actionListener | " + String.valueOf(this.visible);
    }
}
