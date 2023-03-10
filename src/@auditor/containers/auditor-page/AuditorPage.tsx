import { Box, Button, CircularProgress, Dialog, DialogContent } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import TabList from '@mui/lab/TabList'
import { cn } from '@bem-react/classname'
import Grid from '@mui/material/Unstable_Grid2'
import Tab from '@mui/material/Tab'

import './AuditorPage.scss'
import {
  selectAuditor,
  selectAuditorErrorMessage,
  selectAuditorSuccessMessage,
  selectAudits,
  selectLoadingAuditor,
  selectLoadingAudits,
  selectProcessingAuditor,
} from '@auditor/state/auditor.selectors'
import { AuditorInfo } from '@auditor/components/auditor-info/AuditorInfo'
import { AuditorPanel } from '@auditor/components/auditor-panel/AuditorPanel'
import { auditorActions } from '@auditor/state/auditor.reducer'
import { AuditorAuditCard } from '@auditor/components/audit-card/AuditorAuditCard'

const componentId = 'AuditorPage'
const bem = cn(componentId)

export const AuditorPage: React.FC = () => {
  const [editDialog, setEditDialog] = React.useState(false)

  const dispatch = useDispatch()

  const auditor = useSelector(selectAuditor)
  const auditorErrorMessage = useSelector(selectAuditorErrorMessage)
  const auditorSuccessMessage = useSelector(selectAuditorSuccessMessage)
  const loadingAuditor = useSelector(selectLoadingAuditor)
  const processingAuditor = useSelector(selectProcessingAuditor)
  const loadingAudits = useSelector(selectLoadingAudits)

  const audits = useSelector(selectAudits)

  const [value, setValue] = React.useState('3')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const submitAuditor = (auditorData: any) =>
    auditorData._id
      ? dispatch(auditorActions.updateAuditor(auditorData))
      : dispatch(auditorActions.createAuditor(auditorData))

  const deleteAuditor = (id: string) => dispatch(auditorActions.deleteAuditor(id))

  useEffect(() => {
    if (value === '1') dispatch(auditorActions.loadAuditsForAuditor())
    if (value === '2') dispatch(auditorActions.loadAuditsForAuditor())
    if (value === '3') dispatch(auditorActions.loadAuditorData())
  }, [value, dispatch])

  const handleEditDialog = () => {
    setEditDialog((state) => !state)
  }

  const cleanSuccessMessage = () => {
    dispatch(auditorActions.cleanSuccessMessage())
  }

  return (
    <motion.div
      className="motion-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box className={bem()}>
        <span className={bem('Title')}>Home</span>

        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label="Auditor Page"
            className={bem('Tabs')}
          >
            <Tab
              label="Audits"
              value="1"
              className={bem('Tab', { active: value === '1' })}
            />

            <Tab
              label="Audit Requests"
              value="2"
              className={bem('Tab', { active: value === '2' })}
            />

            <Tab
              label="My Info"
              value="3"
              className={bem('Tab', { active: value === '3' })}
            />
          </TabList>

          <TabPanel value="1" className={bem('TabPanel', { audits: true })}>
            <Grid container>
              <Grid xs={12} display="flex">
                <Button
                  variant="contained"
                  color="secondary"
                  data-testid={bem('Button', { create: true })}
                  className={bem('Button', { create: true })}
                >
                  + New Audit
                </Button>
              </Grid>
              {loadingAudits ? (
                <Grid xs={12} display="flex">
                  <CircularProgress className={bem('Loading')} />
                </Grid>
              ) : audits ? (
                audits
                  .filter((audit) => audit.status !== 'pending')
                  .map((audit) => (
                    <Grid sm={12} md={6} key={audit._id}>
                      <AuditorAuditCard audit={audit} />
                    </Grid>
                  ))
              ) : (
                <Grid xs={12} className={bem('Nothing')}>
                  {'Nothing yet...'}
                </Grid>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value="2" className={bem('TabPanel', { requests: true })}>
            <Grid container>
              {loadingAudits ? (
                <Grid xs={12} display="flex">
                  <CircularProgress className={bem('Loading')} />
                </Grid>
              ) : audits.filter((audit) => audit.status === 'pending').length !== 0 ? (
                audits
                  .filter((audit) => audit.status === 'pending')
                  .map((audit) => (
                    <Grid sm={12} md={6} key={audit._id}>
                      <AuditorAuditCard audit={audit} />
                    </Grid>
                  ))
              ) : (
                <Grid xs={12} className={bem('Empty')}>
                  {'Nothing yet...'}
                </Grid>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value="3" className={bem('TabPanel')}>
            {auditor === null ? (
              <Button variant="contained" color="secondary" onClick={handleEditDialog}>
                Create Auditor
              </Button>
            ) : (
              <AuditorInfo
                auditor={auditor!}
                avatarUrl={'1'}
                submit={handleEditDialog}
                submitLable={'Edit'}
              />
            )}

            <Dialog open={editDialog} onClose={handleEditDialog}>
              <DialogContent>
                <AuditorPanel
                  auditor={auditor}
                  errorMessage={auditorErrorMessage}
                  loading={loadingAuditor}
                  processing={processingAuditor}
                  successMessage={auditorSuccessMessage}
                  remove={deleteAuditor}
                  submit={submitAuditor}
                  cancel={handleEditDialog}
                  cleanSuccessMessage={cleanSuccessMessage}
                />
              </DialogContent>
            </Dialog>
          </TabPanel>
        </TabContext>
      </Box>
    </motion.div>
  )
}
