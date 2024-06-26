import * as React from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  ClickAwayListener,
  DropDownIcon,
  CustomTooltip,
  WHITE,
} from '@layer5/sistent';

export default function ActionButton({
  defaultActionLabel,
  defaultActionIcon,
  defaultActionTooltipTitle,
  defaultActionClick,
  options,
}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleMenuItemClick = () => {
    setOpen(false);
  };

  const handleToggle = (event) => {
    event.stopPropagation();
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <div ref={anchorRef}>
        <ButtonGroup
          variant="contained"
          style={{ boxShadow: 'none' }}
          sx={{ '.MuiButtonGroup-grouped': { borderColor: WHITE } }}
          aria-label="Button group with a nested menu"
        >
          <CustomTooltip title={defaultActionTooltipTitle} placement="top" interactive>
            <Button onClick={defaultActionClick} variant="contained">
              {defaultActionIcon}
              {defaultActionLabel}
            </Button>
          </CustomTooltip>
          <Button size="small" onClick={handleToggle} variant="contained">
            <DropDownIcon />
          </Button>
        </ButtonGroup>
      </div>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList id="split-button-menu" autoFocusItem>
              {options
                .filter((option) => option.show)
                .map((option, index) => (
                  <MenuItem
                    disabled={option.disabled}
                    key={option}
                    onClick={(event) => {
                      handleMenuItemClick(event);
                      option.onClick(event, index);
                    }}
                  >
                    <div style={{ marginRight: '0.5rem' }}>{option.icon}</div>
                    {option.label}
                  </MenuItem>
                ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
}
