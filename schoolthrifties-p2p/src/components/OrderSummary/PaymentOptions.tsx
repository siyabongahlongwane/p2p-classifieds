import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const PaymentOptions = ({
  selected,
  onChange,
  walletBalance,
  disableWallet
}: {
  selected: string;
  onChange: (val: string) => void;
  walletBalance: number;
  disableWallet: boolean;
}) => {
  const paymentOptions = [{ value: 'ozow', label: 'Ozow' }];
  
  return (
    <FormControl component="fieldset">
      <RadioGroup value={selected} onChange={(e) => onChange(e.target.value)}>
        {paymentOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            disabled={selected === 'wallet'}
          />
        ))}
        {+walletBalance > 0 && (
          <FormControlLabel
            value="wallet"
            control={<Radio />}
            label={`Wallet (R${walletBalance})`}
            disabled={disableWallet}
          />
        )}
      </RadioGroup>
    </FormControl>
  );
};

export default PaymentOptions;
