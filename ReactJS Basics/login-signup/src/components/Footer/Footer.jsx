import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Box, Grid, Typography, Link } from '@mui/material';

export default function Footer() {
    return (
        <Box component="footer" bgcolor="background.paper" borderTop={1} borderColor="divider" py={6}>
            <Container maxWidth="xl">
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Link component={RouterLink} to="/" display="flex" alignItems="center">
                            <img
                                src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
                                alt="Logo"
                                style={{ height: 64, marginRight: 12 }}
                            />
                        </Link>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={8}>
                            <Grid item>
                                <Typography variant="h6" gutterBottom>
                                    Resources
                                </Typography>
                                <Link component={RouterLink} to="/"  underline="none" color="textSecondary" display="block" gutterBottom>
                                    Home
                                </Link>
                                <Link component={RouterLink} to="/about"  underline="none" color="textSecondary" display="block">
                                    About
                                </Link>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" gutterBottom>
                                    Follow us
                                </Typography>
                                <Link href="https://github.com/samishakoor"  underline="none" target="_blank" rel="noreferrer" color="textSecondary" display="block" gutterBottom>
                                    Github
                                </Link>
                                <Link component={RouterLink} to="/"  underline="none" color="textSecondary" display="block">
                                    Discord
                                </Link>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" gutterBottom>
                                    Legal
                                </Typography>
                                <Link component={RouterLink} to="#"  underline="none" color="textSecondary" display="block" gutterBottom>
                                    Privacy Policy
                                </Link>
                                <Link component={RouterLink} to="#"  underline="none" color="textSecondary" display="block">
                                    Terms &amp; Conditions
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
               
            </Container>
        </Box>
    );
}
