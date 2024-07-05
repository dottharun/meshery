import React, { useState } from 'react';
import { Avatar, Divider, Grid, IconButton, Link } from '@material-ui/core';
import {
  Button,
  CustomTooltip,
  EditIcon,
  InfoIcon,
  OutlinedPatternIcon,
  RenderMarkdown,
  Typography,
  WHITE,
  redDelete,
} from '@layer5/sistent';
import { UsesSistent } from '../SistentWrapper';
import DeleteIcon from '@material-ui/icons/Delete';
import Save from '@material-ui/icons/Save';
import Fullscreen from '@material-ui/icons/Fullscreen';
import Moment from 'react-moment';
import GetAppIcon from '@material-ui/icons/GetApp';
import FlipCard from '../FlipCard';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import FullscreenExit from '@material-ui/icons/FullscreenExit';
import UndeployIcon from '../../public/static/img/UndeployIcon';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import useStyles from './Cards.styles';
import YAMLDialog from '../YamlDialog';
import PublicIcon from '@material-ui/icons/Public';
import CloneIcon from '../../public/static/img/CloneIcon';
import { VISIBILITY } from '@/utils/Enum';
import { useTheme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { MESHERY_CLOUD_PROD } from '../../constants/endpoints';
import { useGetUserByIdQuery } from '../../rtk-query/user';
import { Provider } from 'react-redux';
import { store } from '../../store';
import CAN from '@/utils/can';
import { keys } from '@/utils/permission_constants';
import ActionButton from './ActionButton';
import DryRunIcon from '@/assets/icons/DryRunIcon';
import CheckIcon from '@/assets/icons/CheckIcon';
import PatternIcon from '@/assets/icons/Pattern';
import { iconLarge } from 'css/icons.styles';

const INITIAL_GRID_SIZE = { xl: 4, md: 6, xs: 12 };

function MesheryPatternCard_({
  id,
  name,
  updated_at,
  created_at,
  pattern_file,
  handleVerify,
  handleDryRun,
  handleUnpublishModal,
  handleDeploy,
  handleUnDeploy,
  handleDownload,
  updateHandler,
  deleteHandler,
  handleClone,
  setSelectedPatterns,
  setYaml,
  description = {},
  visibility,
  canPublishPattern = false,
  user,
  pattern,
  handleInfoModal,
  hideVisibility = false,
  isReadOnly = false,
}) {
  const router = useRouter();

  const genericClickHandler = (ev, fn) => {
    ev.stopPropagation();
    fn(ev);
  };
  const [gridProps, setGridProps] = useState(INITIAL_GRID_SIZE);
  const [fullScreen, setFullScreen] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  const { data: owner } = useGetUserByIdQuery(pattern.user_id || '');
  const catalogContentKeys = Object.keys(description);
  const catalogContentValues = Object.values(description);
  const classes = useStyles();
  const theme = useTheme();

  const editInConfigurator = () => {
    router.push('/configuration/designs/configurator?design_id=' + id);
  };
  const userCanEdit =
    CAN(keys.EDIT_DESIGN.action, keys.EDIT_DESIGN.subject) || user?.user_id == pattern?.user_id; // allow if owner

  const descriptionData = pattern?.catalog_data?.pattern_info;

  return (
    <>
      {fullScreen && (
        <YAMLDialog
          fullScreen={fullScreen}
          name={name}
          toggleFullScreen={toggleFullScreen}
          config_file={pattern_file}
          setYaml={setYaml}
          updateHandler={updateHandler}
          deleteHandler={deleteHandler}
          type={'pattern'}
          isReadOnly={isReadOnly}
        />
      )}
      <FlipCard
        onClick={() => {
          console.log(gridProps);
          setGridProps(INITIAL_GRID_SIZE);
        }}
        duration={600}
        onShow={() =>
          setTimeout(() => setShowCode((currentCodeVisibilty) => !currentCodeVisibilty), 500)
        }
      >
        {/* FRONT PART */}
        <UsesSistent>
          <div>
            <div style={{ height: 'max', display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '20rem',
                }}
                variant="h6"
                component="div"
              >
                {name}
              </Typography>
              {hideVisibility ? (
                <PatternIcon {...iconLarge} color={true} />
              ) : (
                <img className={classes.img} src={`/static/img/${visibility}.svg`} />
              )}
            </div>
            <div className={classes.lastRunText}>
              <div>
                {updated_at ? (
                  <Typography
                    variant="caption"
                    style={{
                      // fontStyle: 'italic',
                      color: `${
                        theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#647881'
                      }`,
                    }}
                  >
                    Modified On: <Moment format="LLL">{updated_at}</Moment>
                  </Typography>
                ) : null}
              </div>
            </div>
            {descriptionData ? (
              <RenderMarkdown content={decodeURIComponent(descriptionData)} />
            ) : (
              'No description Provided.'
            )}
          </div>
          <div className={classes.bottomPart}>
            <div className={classes.cardButtons}>
              <CustomTooltip title="Design Information" placement="top" interactive>
                <div>
                  <Button
                    variant="outlined"
                    onClick={(ev) => genericClickHandler(ev, handleInfoModal)}
                    className={classes.testsButton}
                    disabled={!CAN(keys.DETAILS_OF_DESIGN.action, keys.DETAILS_OF_DESIGN.subject)}
                  >
                    <InfoIcon style={{ fill: WHITE }} className={classes.iconPatt} />
                    <span className={classes.btnText}> Details </span>
                  </Button>
                </div>
              </CustomTooltip>
              <ActionButton
                defaultActionClick={(e) => genericClickHandler(e, editInConfigurator)}
                defaultActionLabel="Edit"
                defaultActionIcon={<EditIcon fill={WHITE} className={classes.iconPatt} />}
                defaultActionTooltipTitle={'Edit in Configurator'}
                defaultActionDisabled={!userCanEdit}
                options={[
                  {
                    label: 'Dry Run',
                    icon: <DryRunIcon className={classes.iconPatt} />,
                    onClick: (e) => genericClickHandler(e, handleDryRun),
                    disabled: !CAN(keys.VALIDATE_DESIGN.action, keys.VALIDATE_DESIGN.subject),
                  },
                  {
                    label: 'Unpublish',
                    icon: <PublicIcon className={classes.iconPatt} />,
                    onClick: (e) => genericClickHandler(e, handleUnpublishModal),
                    disabled: !CAN(keys.UNPUBLISH_DESIGN.action, keys.UNPUBLISH_DESIGN.subject),
                    show: canPublishPattern && visibility === VISIBILITY.PUBLISHED,
                  },
                  {
                    label: 'Clone',
                    icon: (
                      <CloneIcon
                        fill={theme.palette.type === 'dark' ? 'white' : 'black'}
                        className={classes.iconPatt}
                      />
                    ),
                    onClick: (ev) => genericClickHandler(ev, handleClone),
                    disabled: !CAN(keys.CLONE_DESIGN.action, keys.CLONE_DESIGN.subject),
                    show: visibility !== VISIBILITY.PRIVATE,
                  },
                  {
                    label: 'Design',
                    icon: (
                      <OutlinedPatternIcon
                        fill={theme.palette.type === 'dark' ? 'white' : 'black'}
                        className={classes.iconPatt}
                      />
                    ),
                    onClick: (ev) => genericClickHandler(ev, setSelectedPatterns),
                    disabled: !CAN(keys.EDIT_DESIGN.action, keys.EDIT_DESIGN.subject),
                    show: visibility === VISIBILITY.PRIVATE,
                  },
                  {
                    label: 'Download',
                    icon: <GetAppIcon data-cy="download-button" />,
                    onClick: handleDownload,
                    disabled: !CAN(keys.DOWNLOAD_A_DESIGN.action, keys.DOWNLOAD_A_DESIGN.subject),
                  },
                  {
                    label: 'Validate',
                    icon: <CheckIcon className={classes.iconPatt} />,
                    onClick: (e) => genericClickHandler(e, handleVerify),
                    disabled: !CAN(keys.VALIDATE_DESIGN.action, keys.VALIDATE_DESIGN.subject),
                  },
                  {
                    label: 'Deploy',
                    icon: <DoneAllIcon className={classes.iconPatt} />,
                    onClick: (e) => genericClickHandler(e, handleDeploy),
                    disabled: !CAN(keys.DEPLOY_DESIGN.action, keys.DEPLOY_DESIGN.subject),
                  },
                  { isDivider: true },
                  {
                    label: <div style={{ color: redDelete.light }}>Undeploy</div>,
                    icon: <UndeployIcon fill={redDelete.light} className={classes.iconPatt} />,
                    onClick: (e) => genericClickHandler(e, handleUnDeploy),
                    disabled: !CAN(keys.UNDEPLOY_DESIGN.action, keys.UNDEPLOY_DESIGN.subject),
                  },
                ]}
              />
            </div>
          </div>
        </UsesSistent>

        {/* BACK PART */}
        <>
          <Grid
            className={classes.backGrid}
            container
            spacing={1}
            alignContent="space-between"
            alignItems="center"
          >
            <Grid item xs={12} className={classes.yamlDialogTitle}>
              <Typography variant="h6" className={classes.yamlDialogTitleText}>
                {name}
              </Typography>
              <div className={classes.cardHeaderRight}>
                <Link href={`${MESHERY_CLOUD_PROD}/user/${pattern?.user_id}`} target="_blank">
                  <Avatar alt="profile-avatar" src={owner?.avatar_url} />
                </Link>
                <CustomTooltip title="Enter Fullscreen" arrow interactive placement="top">
                  <IconButton
                    onClick={(ev) =>
                      genericClickHandler(ev, () => {
                        {
                          toggleFullScreen();
                        }
                      })
                    }
                  >
                    {fullScreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </CustomTooltip>
              </div>
            </Grid>
            <Grid item xs={12} onClick={(ev) => genericClickHandler(ev, () => {})}>
              <Divider variant="fullWidth" light />
              {catalogContentKeys.length === 0 ? (
                <CodeMirror
                  value={showCode && pattern_file}
                  className={fullScreen ? classes.fullScreenCodeMirror : ''}
                  options={{
                    theme: 'material',
                    lineNumbers: true,
                    lineWrapping: true,
                    gutters: ['CodeMirror-lint-markers'],
                    // @ts-ignore
                    lint: true,
                    mode: 'text/x-yaml',
                    readOnly: isReadOnly,
                  }}
                  onChange={(_, data, val) => setYaml(val)}
                />
              ) : (
                catalogContentKeys.map((title, index) => (
                  <>
                    <Typography variant="h6" className={classes.yamlDialogTitleText}>
                      {title}
                    </Typography>
                    <Typography variant="body2">{catalogContentValues[index]}</Typography>
                  </>
                ))
              )}
            </Grid>

            <Grid item xs={8}>
              <div className={classes.lastRunText}>
                <div>
                  {created_at ? (
                    <Typography
                      variant="caption"
                      style={{
                        fontStyle: 'italic',
                        color: `${
                          theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#647881'
                        }`,
                      }}
                    >
                      Created at: <Moment format="LLL">{created_at}</Moment>
                    </Typography>
                  ) : null}
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              {isReadOnly ? null : (
                <div className={classes.updateDeleteButtons}>
                  {/* Save button */}
                  <CustomTooltip title="Save" arrow interactive placement="bottom">
                    <IconButton
                      disabled={!CAN(keys.EDIT_DESIGN.action, keys.EDIT_DESIGN.subject)}
                      onClick={(ev) => genericClickHandler(ev, updateHandler)}
                    >
                      <Save color="primary" />
                    </IconButton>
                  </CustomTooltip>

                  {/* Delete Button */}
                  <CustomTooltip title="Delete" arrow interactive placement="bottom">
                    <IconButton
                      disabled={!CAN(keys.DELETE_A_DESIGN.action, keys.DELETE_A_DESIGN.subject)}
                      onClick={(ev) => genericClickHandler(ev, deleteHandler)}
                    >
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </CustomTooltip>
                </div>
              )}
            </Grid>
          </Grid>
        </>
      </FlipCard>
    </>
  );
}

export const MesheryPatternCard = (props) => {
  return (
    <Provider store={store}>
      <MesheryPatternCard_ {...props} />
    </Provider>
  );
};

// @ts-ignore
export default MesheryPatternCard;
