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
  Divider,
  Box,
} from '@layer5/sistent';

export default function ActionButton({
  defaultActionLabel,
  defaultActionIcon,
  defaultActionTooltipTitle,
  defaultActionClick,
  defaultActionDisabled,
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
            <div>
              <Button
                onClick={defaultActionClick}
                variant="contained"
                disabled={defaultActionDisabled}
              >
                {defaultActionIcon}
                {defaultActionLabel}
              </Button>
            </div>
          </CustomTooltip>
          <Button size="small" onClick={handleToggle} variant="contained">
            <DropDownIcon width="18" height="18" />
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
                .filter((option) => option.show !== false)
                .map((option, index) =>
                  option.isDivider ? (
                    <Divider />
                  ) : (
                    <MenuItem
                      disabled={option.disabled}
                      key={option}
                      onClick={(event) => {
                        handleMenuItemClick(event);
                        option.onClick(event, index);
                      }}
                    >
                      <Box display="flex" width="12.5rem">
                        {option.icon}
                        <Box textAlign="right" flexGrow={1}>
                          {option.label}
                        </Box>
                      </Box>
                    </MenuItem>
                  ),
                )}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
}
