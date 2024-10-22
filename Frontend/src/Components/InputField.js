import classes from './InputField.module.css'

const InputField = ({ icon: Icon, placeholder, type, value, onChange }) => (
    <div className={classes.inputFieldContainer}>
      <Icon className={classes.icon} size={20} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={classes.inputField}
      />
    </div>
  );


export default InputField;