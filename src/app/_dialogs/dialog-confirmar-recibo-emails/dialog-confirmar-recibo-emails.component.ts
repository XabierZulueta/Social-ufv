import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-confirmar-recibo-emails',
  templateUrl: './dialog-confirmar-recibo-emails.component.html',
  styleUrls: ['./dialog-confirmar-recibo-emails.component.css']
})
export class DialogConfirmarReciboEmailsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmarReciboEmailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
}
